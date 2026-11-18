import {
  ref,
  push,
  set,
  get,
  update,
  onValue,
  Unsubscribe,
} from 'firebase/database';
import { database, isFirebaseConfigured } from './firebase';
import { Activity, ActivityCategory } from '../types/activity';
import { CampusId } from '../types/campus';
import { UserProfile } from '../types/user';
import { sanitizeFirebasePayload } from '../utils/clean';

export async function createActivity(
  data: {
    title: string;
    description: string;
    category: ActivityCategory;
    campus: CampusId;
    location: {
      name: string;
      latitude: number;
      longitude: number;
    };
    startTime: number;
    endTime?: number;
    maxParticipants?: number;
  },
  host: UserProfile
): Promise<string> {
  if (!isFirebaseConfigured) {
    throw new Error('Firebase is not configured. Check your .env file.');
  }

  const activitiesRef = ref(database, 'activities');
  const newActivityRef = push(activitiesRef);
  const activityId = newActivityRef.key;

  if (!activityId) {
    throw new Error('Failed to generate activity ID.');
  }

  const newActivity: Partial<Activity> = {
    id: activityId,
    title: data.title.trim(),
    description: data.description.trim(),
    category: data.category,
    campus: data.campus,
    location: data.location,
    hostId: host.uid,
    hostName: host.displayName,
    startTime: data.startTime,
    status: 'active',
    createdAt: Date.now(),
    participantCount: 1, // Host is registered automatically
  };

  if (host.photoURL) newActivity.hostPhotoURL = host.photoURL;
  if (data.endTime) newActivity.endTime = data.endTime;
  if (data.maxParticipants) newActivity.maxParticipants = data.maxParticipants;

  // 1. Write the activity with sanitized payload
  await set(newActivityRef, sanitizeFirebasePayload(newActivity));

  // 2. Automatically register host as first participant in /participants/<activityId>/<hostUid>
  const hostParticipantRef = ref(database, `participants/${activityId}/${host.uid}`);
  const hostRecord: Record<string, any> = {
    joinedAt: Date.now(),
    displayName: host.displayName,
  };
  if (host.photoURL) hostRecord.photoURL = host.photoURL;

  await set(hostParticipantRef, hostRecord);

  return activityId;
}

export async function cancelActivity(activityId: string, hostId: string): Promise<void> {
  if (!isFirebaseConfigured) return;

  const activityRef = ref(database, `activities/${activityId}`);
  const snapshot = await get(activityRef);

  if (!snapshot.exists()) {
    throw new Error('Activity not found.');
  }

  const activity = snapshot.val() as Activity;
  if (activity.hostId !== hostId) {
    throw new Error('Only the host can cancel this activity.');
  }

  await update(activityRef, {
    status: 'canceled',
  });
}

export function subscribeToActivities(
  callback: (activities: Activity[]) => void
): Unsubscribe {
  if (!isFirebaseConfigured) {
    callback([]);
    return () => {};
  }

  const activitiesRef = ref(database, 'activities');

  return onValue(
    activitiesRef,
    (snapshot) => {
      if (!snapshot.exists()) {
        callback([]);
        return;
      }

      const data = snapshot.val();
      const list: Activity[] = Object.keys(data).map((key) => ({
        ...data[key],
        id: key,
      }));

      // Sort by start time ascending
      list.sort((a, b) => a.startTime - b.startTime);

      callback(list);
    },
    (error) => {
      console.error('Error listening to activities:', error);
      callback([]);
    }
  );
}

export async function getActivity(activityId: string): Promise<Activity | null> {
  if (!isFirebaseConfigured) return null;
  const activityRef = ref(database, `activities/${activityId}`);
  const snapshot = await get(activityRef);
  if (!snapshot.exists()) return null;
  return {
    ...(snapshot.val() as Activity),
    id: activityId,
  };
}
