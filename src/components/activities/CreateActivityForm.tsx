import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createActivitySchema, CreateActivityFormData } from '../../utils/validation';
import { CampusId } from '../../types/campus';
import { UserProfile } from '../../types/user';
import { CAMPUS_LOCATIONS } from '../../data/locations';
import { CATEGORIES } from '../../utils/categories';
import { createActivity } from '../../services/activityService';
import { format, addHours } from 'date-fns';
import { X, Calendar, Clock, MapPin, Users, PlusCircle } from 'lucide-react';
import { toast } from 'sonner';

interface CreateActivityFormProps {
  initialCampus: CampusId;
  currentUser: UserProfile;
  isOpen: boolean;
  onClose: () => void;
  onCreated: (activityId: string) => void;
}

export const CreateActivityForm: React.FC<CreateActivityFormProps> = ({
  initialCampus,
  currentUser,
  isOpen,
  onClose,
  onCreated,
}) => {
  const [submitting, setSubmitting] = useState<boolean>(false);

  // Pre-seed default start time to 1 hour from now
  const nextHour = addHours(new Date(), 1);
  const defaultDateStr = format(nextHour, 'yyyy-MM-dd');
  const defaultTimeStr = format(nextHour, 'HH:00');

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    reset,
  } = useForm<CreateActivityFormData>({
    resolver: zodResolver(createActivitySchema),
    defaultValues: {
      campus: initialCampus,
      category: 'study',
      startDate: defaultDateStr,
      startTime: defaultTimeStr,
    },
  });

  React.useEffect(() => {
    if (isOpen) {
      reset({
        campus: initialCampus,
        category: 'study',
        startDate: format(addHours(new Date(), 1), 'yyyy-MM-dd'),
        startTime: format(addHours(new Date(), 1), 'HH:00'),
        locationId: '',
        title: '',
        description: '',
        customLocationDetails: '',
      });
    }
  }, [isOpen, initialCampus, reset]);

  const selectedCampus = watch('campus');
  const availableLocations = CAMPUS_LOCATIONS.filter(
    (loc) => loc.campus === selectedCampus
  );

  const onSubmit = async (data: CreateActivityFormData) => {
    setSubmitting(true);
    try {
      // Find selected location details
      const matchedLocation = CAMPUS_LOCATIONS.find((l) => l.id === data.locationId);
      if (!matchedLocation) {
        toast.error('Please select a valid campus location.');
        setSubmitting(false);
        return;
      }

      // Construct start timestamp
      const startDateTimeStr = `${data.startDate}T${data.startTime}:00`;
      const startTimeMs = new Date(startDateTimeStr).getTime();

      let endTimeMs: number | undefined = undefined;
      if (data.endDate && data.endTime) {
        const endDateTimeStr = `${data.endDate}T${data.endTime}:00`;
        endTimeMs = new Date(endDateTimeStr).getTime();
        if (endTimeMs <= startTimeMs) {
          toast.error('End time must be after the start time.');
          setSubmitting(false);
          return;
        }
      }

      const locationName = data.customLocationDetails
        ? `${matchedLocation.name} (${data.customLocationDetails.trim()})`
        : matchedLocation.name;

      const activityId = await createActivity(
        {
          title: data.title,
          description: data.description,
          category: data.category,
          campus: data.campus,
          location: {
            name: locationName,
            latitude: matchedLocation.latitude,
            longitude: matchedLocation.longitude,
          },
          startTime: startTimeMs,
          endTime: endTimeMs,
          maxParticipants: data.maxParticipants,
        },
        currentUser
      );

      toast.success('Activity created successfully!');
      reset();
      onCreated(activityId);
      onClose();
    } catch (err: any) {
      toast.error(err.message || 'Failed to create activity.');
    } finally {
      setSubmitting(false);
    }
  };

  const onFormError = (formErrors: any) => {
    const errorList = Object.values(formErrors) as any[];
    if (errorList.length > 0 && errorList[0]?.message) {
      toast.error(errorList[0].message);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-slate-900">Post a Campus Activity</h3>
            <p className="text-xs text-slate-500">
              Gather Fordham students for a study group, meal, or event
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit(onSubmit, onFormError)} className="p-6 overflow-y-auto space-y-4 flex-1">
          {/* Title */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Activity Title *
            </label>
            <input
              type="text"
              {...register('title')}
              placeholder="e.g. CS2 Study Group for Midterm"
              className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-fordham-maroon/20 focus:border-fordham-maroon"
            />
            {errors.title && (
              <p className="text-xs text-rose-600 mt-1">{errors.title.message}</p>
            )}
          </div>

          {/* Category & Campus Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Category *
              </label>
              <select
                {...register('category')}
                className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-fordham-maroon/20 focus:border-fordham-maroon"
              >
                {Object.entries(CATEGORIES).map(([catKey, meta]) => (
                  <option key={catKey} value={catKey}>
                    {meta.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Campus *
              </label>
              <select
                {...register('campus')}
                className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-fordham-maroon/20 focus:border-fordham-maroon"
              >
                <option value="rose-hill">Rose Hill (Bronx)</option>
                <option value="lincoln-center">Lincoln Center (Manhattan)</option>
              </select>
            </div>
          </div>

          {/* Location Picker */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Campus Landmark / Building *
            </label>
            <div className="relative">
              <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <select
                {...register('locationId')}
                className="w-full pl-10 pr-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-fordham-maroon/20 focus:border-fordham-maroon"
              >
                <option value="">Select a recognizable location...</option>
                {availableLocations.map((loc) => (
                  <option key={loc.id} value={loc.id}>
                    {loc.name}
                  </option>
                ))}
              </select>
            </div>
            {errors.locationId && (
              <p className="text-xs text-rose-600 mt-1">{errors.locationId.message}</p>
            )}
          </div>

          {/* Specific Location Note */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Room / Spot Details (Optional)
            </label>
            <input
              type="text"
              {...register('customLocationDetails')}
              placeholder="e.g. 2nd Floor Study Room 204 or Near the Fountain"
              className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-fordham-maroon/20 focus:border-fordham-maroon"
            />
          </div>

          {/* Start Date & Time */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Start Date *
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="date"
                  {...register('startDate')}
                  className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-fordham-maroon/20"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Start Time *
              </label>
              <div className="relative">
                <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="time"
                  {...register('startTime')}
                  className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-fordham-maroon/20"
                />
              </div>
            </div>
          </div>

          {/* Capacity Limit */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Participant Limit (Optional)
            </label>
            <div className="relative">
              <Users className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="number"
                min="2"
                max="100"
                {...register('maxParticipants')}
                placeholder="Leave blank for unlimited capacity"
                className="w-full pl-10 pr-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-fordham-maroon/20 focus:border-fordham-maroon"
              />
            </div>
            {errors.maxParticipants && (
              <p className="text-xs text-rose-600 mt-1">{errors.maxParticipants.message}</p>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Description *
            </label>
            <textarea
              rows={3}
              {...register('description')}
              placeholder="What will you do? What should attendees bring or prepare?"
              className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-fordham-maroon/20 focus:border-fordham-maroon"
            />
            {errors.description && (
              <p className="text-xs text-rose-600 mt-1">{errors.description.message}</p>
            )}
          </div>

          {/* Submit Buttons */}
          <div className="pt-2 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 text-sm font-semibold hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-5 py-2.5 rounded-xl bg-fordham-maroon text-white text-sm font-semibold hover:bg-fordham-maroonDark transition-colors shadow-sm disabled:opacity-50 flex items-center gap-2"
            >
              <PlusCircle className="w-4 h-4" />
              <span>{submitting ? 'Publishing...' : 'Publish Activity'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
