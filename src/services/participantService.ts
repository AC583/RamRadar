import {
  ref,
  set,
  remove,
  get,
  runTransaction,
  onValue,
  Unsubscribe,
} from 'firebase/database';
import { database, isFirebaseConfigured } from './firebase';
import { Activity, ActivityParticipants, ParticipantRecord } from '../types/activity';
import { UserProfile } from '../types/user';

export async function joinActivity(
  activityId: string,
  user: UserProfile
): Promise<{ success: boolean; error?: string }> {
  if (!isFirebaseConfigured) {
    return { success: false, error: 'Firebase is not configured.' };
  }

  const participantRef = ref(database, `participants/${activityId}/${user.uid}`);
  const existingParticipant = await get(participantRef);

  if (existingParticipant.exists()) {
    return { success: false, error: 'You are already participating in this activity.' };
  }

  const activityRef = ref(database, `activities/${activityId}`);

  try {
    // Atomic transaction on the activity to verify capacity & update participant count
    const transactionResult = await runTransaction(activityRef, (currentActivity: Activity | null) => {
      if (!currentActivity) {
        return currentActivity; // abort
      }

      if (currentActivity.status === 'canceled') {
        throw new Error('This activity has been canceled.');
      }

      const currentCount = currentActivity.participantCount || 1;
      const max = currentActivity.maxParticipants;

      if (max && currentCount >= max) {
        throw new Error('This activity has already reached maximum capacity.');
      }

      const updatedCount = currentCount + 1;
      const updatedStatus = max && updatedCount >= max ? 'full' : currentActivity.status;

      return {
        ...currentActivity,
        participantCount: updatedCount,
        status: updatedStatus,
      };
    });

    if (!transactionResult.committed) {
      return { success: false, error: 'Could not join activity. Please try again.' };
    }

    // Now write the participant record without undefined
    const participantRecord: Record<string, any> = {
      joinedAt: Date.now(),
      displayName: user.displayName,
    };
    if (user.photoURL) {
      participantRecord.photoURL = user.photoURL;
    }

    await set(participantRef, participantRecord);

    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || 'Failed to join activity.' };
  }
}

export async function leaveActivity(
  activityId: string,
  userId: string
): Promise<{ success: boolean; error?: string }> {
  if (!isFirebaseConfigured) {
    return { success: false, error: 'Firebase is not configured.' };
  }

  const participantRef = ref(database, `participants/${activityId}/${userId}`);
  const existingParticipant = await get(participantRef);

  if (!existingParticipant.exists()) {
    return { success: false, error: 'You are not registered for this activity.' };
  }

  const activityRef = ref(database, `activities/${activityId}`);

  try {
    // Atomic transaction to decrement participant count
    await runTransaction(activityRef, (currentActivity: Activity | null) => {
      if (!currentActivity) return currentActivity;

      const currentCount = currentActivity.participantCount || 1;
      const updatedCount = Math.max(0, currentCount - 1);

      // If it was full and now has space, return to active
      let updatedStatus = currentActivity.status;
      if (currentActivity.status === 'full' && currentActivity.maxParticipants && updatedCount < currentActivity.maxParticipants) {
        updatedStatus = 'active';
      }

      return {
        ...currentActivity,
        participantCount: updatedCount,
        status: updatedStatus,
      };
    });

    // Remove the participant record
    await remove(participantRef);

    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || 'Failed to leave activity.' };
  }
}

export function subscribeToParticipants(
  activityId: string,
  callback: (participants: ActivityParticipants) => void
): Unsubscribe {
  if (!isFirebaseConfigured) {
    callback({});
    return () => {};
  }

  const participantsRef = ref(database, `participants/${activityId}`);

  return onValue(participantsRef, (snapshot) => {
    if (snapshot.exists()) {
      callback(snapshot.val() as ActivityParticipants);
    } else {
      callback({});
    }
  });
}
