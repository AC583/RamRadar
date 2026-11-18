import React, { useState, useEffect } from 'react';
import { Activity, ActivityParticipants } from '../../types/activity';
import { UserProfile } from '../../types/user';
import { CATEGORIES } from '../../utils/categories';
import { formatActivityTime } from '../../utils/dateUtils';
import { joinActivity, leaveActivity, subscribeToParticipants } from '../../services/participantService';
import { cancelActivity } from '../../services/activityService';
import {
  MapPin,
  Clock,
  Users,
  X,
  AlertCircle,
  CheckCircle,
  UserCheck,
  LogOut,
  Ban,
  Shield,
} from 'lucide-react';
import { toast } from 'sonner';

interface ActivityDetailsProps {
  activity: Activity;
  currentUser: UserProfile | null;
  onClose: () => void;
  onSignInRequired: () => void;
  onActivityUpdated?: () => void;
}

export const ActivityDetails: React.FC<ActivityDetailsProps> = ({
  activity,
  currentUser,
  onClose,
  onSignInRequired,
  onActivityUpdated,
}) => {
  const [participants, setParticipants] = useState<ActivityParticipants>({});
  const [loadingAction, setLoadingAction] = useState<boolean>(false);
  const [showCancelConfirm, setShowCancelConfirm] = useState<boolean>(false);

  // Subscribe to real-time participant changes for this activity
  useEffect(() => {
    const unsubscribe = subscribeToParticipants(activity.id, (records) => {
      setParticipants(records);
    });

    return () => {
      unsubscribe();
    };
  }, [activity.id]);

  const categoryMeta = CATEGORIES[activity.category] || CATEGORIES.other;
  const isHost = Boolean(currentUser && currentUser.uid === activity.hostId);
  const isParticipant = Boolean(currentUser && participants[currentUser.uid]);
  const participantList = Object.entries(participants).map(([uid, p]) => ({
    uid,
    ...p,
  }));

  const currentCount = Math.max(participantList.length, activity.participantCount || 1);
  const max = activity.maxParticipants;
  const isFull = Boolean(max && currentCount >= max);
  const isCanceled = activity.status === 'canceled';

  const handleJoin = async () => {
    if (!currentUser) {
      onSignInRequired();
      return;
    }

    setLoadingAction(true);
    try {
      const res = await joinActivity(activity.id, currentUser);
      if (res.success) {
        toast.success(`You joined "${activity.title}"!`);
        onActivityUpdated?.();
      } else {
        toast.error(res.error || 'Failed to join.');
      }
    } catch (err: any) {
      toast.error(err.message || 'Error joining activity.');
    } finally {
      setLoadingAction(false);
    }
  };

  const handleLeave = async () => {
    if (!currentUser) return;

    setLoadingAction(true);
    try {
      const res = await leaveActivity(activity.id, currentUser.uid);
      if (res.success) {
        toast.info(`You left "${activity.title}".`);
        onActivityUpdated?.();
      } else {
        toast.error(res.error || 'Failed to leave.');
      }
    } catch (err: any) {
      toast.error(err.message || 'Error leaving activity.');
    } finally {
      setLoadingAction(false);
    }
  };

  const handleCancelActivity = async () => {
    if (!currentUser || !isHost) return;

    setLoadingAction(true);
    try {
      await cancelActivity(activity.id, currentUser.uid);
      toast.success('Activity has been canceled.');
      setShowCancelConfirm(false);
      onActivityUpdated?.();
      onClose();
    } catch (err: any) {
      toast.error(err.message || 'Failed to cancel activity.');
    } finally {
      setLoadingAction(false);
    }
  };

  return (
    <div className="h-full flex flex-col bg-white border-l border-slate-200 overflow-y-auto">
      {/* Header */}
      <div className="p-5 border-b border-slate-100 flex items-start justify-between gap-4 sticky top-0 bg-white/95 backdrop-blur-sm z-10">
        <div>
          <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${categoryMeta.badgeClass}`}
          >
            {categoryMeta.label}
          </span>
          <h3 className="text-xl font-bold text-slate-900 mt-2 leading-snug">
            {activity.title}
          </h3>
        </div>

        <button
          onClick={onClose}
          className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Main Body */}
      <div className="p-5 space-y-6 flex-1">
        {/* Status Alert if Canceled */}
        {isCanceled && (
          <div className="bg-rose-50 border border-rose-200 rounded-xl p-3.5 flex items-center gap-3 text-rose-800 text-sm">
            <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
            <div>
              <p className="font-semibold">This activity was canceled</p>
              <p className="text-xs text-rose-600">No further participation is permitted.</p>
            </div>
          </div>
        )}

        {/* Location & Time Info */}
        <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 space-y-3">
          <div className="flex items-start gap-3 text-sm">
            <MapPin className="w-4 h-4 text-fordham-maroon mt-0.5 shrink-0" />
            <div>
              <span className="font-semibold text-slate-800">{activity.location.name}</span>
              <p className="text-xs text-slate-500 capitalize">{activity.campus.replace('-', ' ')} campus</p>
            </div>
          </div>

          <div className="flex items-start gap-3 text-sm">
            <Clock className="w-4 h-4 text-fordham-maroon mt-0.5 shrink-0" />
            <div>
              <span className="font-medium text-slate-800">
                {formatActivityTime(activity.startTime, activity.endTime)}
              </span>
            </div>
          </div>
        </div>

        {/* Description */}
        <div>
          <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
            About this gathering
          </h4>
          <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-line">
            {activity.description}
          </p>
        </div>

        {/* Host Information */}
        <div>
          <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
            Hosted by
          </h4>
          <div className="flex items-center gap-3 bg-slate-50 p-3 rounded-xl border border-slate-100">
            {activity.hostPhotoURL ? (
              <img
                src={activity.hostPhotoURL}
                alt={activity.hostName || 'Host'}
                className="w-10 h-10 rounded-full object-cover border border-slate-200"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-fordham-maroon text-white flex items-center justify-center font-bold text-sm">
                {(activity.hostName || 'F')[0].toUpperCase()}
              </div>
            )}
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-slate-900">
                  {activity.hostName || 'Fordham Student'}
                </span>
                {isHost && (
                  <span className="text-[10px] bg-fordham-maroon/10 text-fordham-maroon font-semibold px-2 py-0.5 rounded-full border border-fordham-maroon/20">
                    You
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500">Activity Creator</p>
            </div>
          </div>
        </div>

        {/* Capacity & Attendance */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5" />
              Participants ({currentCount} {max ? `/ ${max}` : ''})
            </h4>
            {isFull && (
              <span className="text-xs font-semibold text-rose-600 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                At Capacity
              </span>
            )}
          </div>

          {max && (
            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden mb-3">
              <div
                className={`h-full transition-all duration-300 ${
                  isFull ? 'bg-rose-500' : 'bg-emerald-500'
                }`}
                style={{ width: `${Math.min(100, (currentCount / max) * 100)}%` }}
              />
            </div>
          )}

          {/* Participant Avatars / List */}
          <div className="space-y-2 mt-2">
            {participantList.length === 0 ? (
              <div className="text-xs text-slate-500 italic p-2 bg-slate-50 rounded-lg">
                Be the first to join!
              </div>
            ) : (
              <div className="flex flex-wrap gap-2">
                {participantList.map((p) => {
                  const isCurrent = currentUser && currentUser.uid === p.uid;
                  return (
                    <div
                      key={p.uid}
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${
                        isCurrent
                          ? 'bg-fordham-maroon/5 border-fordham-maroon/30 text-fordham-maroon'
                          : 'bg-slate-100 border-slate-200 text-slate-700'
                      }`}
                    >
                      {p.photoURL ? (
                        <img src={p.photoURL} alt="" className="w-4 h-4 rounded-full" />
                      ) : (
                        <span className="w-4 h-4 rounded-full bg-slate-300 text-[9px] flex items-center justify-center font-bold text-slate-700">
                          {(p.displayName || 'U')[0]}
                        </span>
                      )}
                      <span>{p.displayName || 'Participant'}</span>
                      {isCurrent && <span className="text-[10px] opacity-75">(You)</span>}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Action Footer */}
      <div className="p-5 border-t border-slate-100 bg-slate-50">
        {!currentUser ? (
          <button
            onClick={onSignInRequired}
            className="w-full py-3 px-4 rounded-xl bg-fordham-maroon text-white font-semibold text-sm hover:bg-fordham-maroonDark transition-colors shadow-sm flex items-center justify-center gap-2"
          >
            <span>Sign in to Join Activity</span>
          </button>
        ) : isCanceled ? (
          <button
            disabled
            className="w-full py-3 px-4 rounded-xl bg-slate-200 text-slate-400 font-semibold text-sm cursor-not-allowed flex items-center justify-center gap-2"
          >
            <Ban className="w-4 h-4" />
            <span>Activity Canceled</span>
          </button>
        ) : isHost ? (
          <div className="space-y-2">
            <div className="w-full py-2.5 px-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-medium flex items-center justify-center gap-2">
              <Shield className="w-4 h-4 text-emerald-600" />
              <span>You are hosting this activity</span>
            </div>

            {showCancelConfirm ? (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl space-y-2 text-center">
                <p className="text-xs font-medium text-rose-800">
                  Are you sure you want to cancel this activity for everyone?
                </p>
                <div className="flex gap-2 justify-center">
                  <button
                    onClick={handleCancelActivity}
                    disabled={loadingAction}
                    className="px-3 py-1.5 bg-rose-600 text-white text-xs font-semibold rounded-lg hover:bg-rose-700 disabled:opacity-50"
                  >
                    {loadingAction ? 'Canceling...' : 'Yes, Cancel'}
                  </button>
                  <button
                    onClick={() => setShowCancelConfirm(false)}
                    className="px-3 py-1.5 bg-white border border-slate-200 text-slate-700 text-xs font-semibold rounded-lg hover:bg-slate-50"
                  >
                    Keep Activity
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => setShowCancelConfirm(true)}
                className="w-full py-2.5 px-4 rounded-xl border border-rose-200 bg-white text-rose-700 text-xs font-semibold hover:bg-rose-50 transition-colors"
              >
                Cancel Activity
              </button>
            )}
          </div>
        ) : isParticipant ? (
          <button
            onClick={handleLeave}
            disabled={loadingAction}
            className="w-full py-3 px-4 rounded-xl bg-white border border-rose-200 text-rose-700 font-semibold text-sm hover:bg-rose-50 transition-colors shadow-sm flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <LogOut className="w-4 h-4" />
            <span>{loadingAction ? 'Leaving...' : 'Leave Activity'}</span>
          </button>
        ) : isFull ? (
          <button
            disabled
            className="w-full py-3 px-4 rounded-xl bg-slate-200 text-slate-400 font-semibold text-sm cursor-not-allowed flex items-center justify-center gap-2"
          >
            <span>Activity is Full</span>
          </button>
        ) : (
          <button
            onClick={handleJoin}
            disabled={loadingAction}
            className="w-full py-3 px-4 rounded-xl bg-fordham-maroon text-white font-semibold text-sm hover:bg-fordham-maroonDark transition-colors shadow-sm flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <UserCheck className="w-4 h-4" />
            <span>{loadingAction ? 'Joining...' : 'Join Activity'}</span>
          </button>
        )}
      </div>
    </div>
  );
};
