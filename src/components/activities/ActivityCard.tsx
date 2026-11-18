import React from 'react';
import { Activity } from '../../types/activity';
import { CATEGORIES } from '../../utils/categories';
import { formatActivityTime } from '../../utils/dateUtils';
import { Users, MapPin, Clock } from 'lucide-react';

interface ActivityCardProps {
  activity: Activity;
  isSelected?: boolean;
  onSelect: (activity: Activity) => void;
}

export const ActivityCard: React.FC<ActivityCardProps> = ({
  activity,
  isSelected = false,
  onSelect,
}) => {
  const categoryMeta = CATEGORIES[activity.category] || CATEGORIES.other;
  const count = activity.participantCount || 1;
  const isFull = Boolean(activity.maxParticipants && count >= activity.maxParticipants);

  return (
    <div
      onClick={() => onSelect(activity)}
      className={`group cursor-pointer rounded-xl border p-4 transition-all duration-200 bg-white hover:shadow-md ${
        isSelected
          ? 'border-fordham-maroon ring-2 ring-fordham-maroon/20 shadow-sm'
          : 'border-slate-200 hover:border-slate-300'
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${categoryMeta.badgeClass}`}
        >
          {categoryMeta.label}
        </span>

        {isFull ? (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-rose-50 text-rose-700 border border-rose-200">
            Full
          </span>
        ) : (
          <div className="flex items-center text-xs font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md">
            <Users className="w-3.5 h-3.5 mr-1 text-slate-500" />
            <span>
              {count}
              {activity.maxParticipants ? ` / ${activity.maxParticipants}` : ''}
            </span>
          </div>
        )}
      </div>

      <h4 className="mt-2.5 text-base font-semibold text-slate-900 group-hover:text-fordham-maroon transition-colors line-clamp-1">
        {activity.title}
      </h4>

      <p className="mt-1 text-xs text-slate-600 line-clamp-2 leading-relaxed">
        {activity.description}
      </p>

      <div className="mt-3.5 pt-3 border-t border-slate-100 flex flex-col gap-1.5 text-xs text-slate-500">
        <div className="flex items-center">
          <MapPin className="w-3.5 h-3.5 mr-1.5 text-slate-400 shrink-0" />
          <span className="truncate font-medium text-slate-700">{activity.location.name}</span>
        </div>
        <div className="flex items-center">
          <Clock className="w-3.5 h-3.5 mr-1.5 text-slate-400 shrink-0" />
          <span>{formatActivityTime(activity.startTime, activity.endTime)}</span>
        </div>
      </div>
    </div>
  );
};
