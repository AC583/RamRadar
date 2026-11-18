import {
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  User as FirebaseUser,
} from 'firebase/auth';
import { ref, set, get } from 'firebase/database';
import { auth, database, googleProvider, isFirebaseConfigured } from './firebase';
import { UserProfile } from '../types/user';

// Local storage key for optional dev mock persona
const DEV_USER_KEY = 'ramradar_dev_persona';

export const DEV_PERSONAS: UserProfile[] = [
  {
    uid: 'dev-alex-rh',
    displayName: 'Alex Rivera',
    email: 'arivera@fordham.edu',
    photoURL: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
    campus: 'rose-hill',
    interests: ['study', 'sports'],
    createdAt: Date.now() - 86400000 * 10,
  },
  {
    uid: 'dev-taylor-lc',
    displayName: 'Taylor Chen',
    email: 'tchen@fordham.edu',
    photoURL: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    campus: 'lincoln-center',
    interests: ['clubs', 'social'],
    createdAt: Date.now() - 86400000 * 5,
  },
  {
    uid: 'dev-sam-rh',
    displayName: 'Samira Patel',
    email: 'spatel@fordham.edu',
    photoURL: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
    campus: 'rose-hill',
    interests: ['academic', 'campus-events'],
    createdAt: Date.now() - 86400000 * 2,
  },
];

export async function signInWithGoogle(): Promise<UserProfile | null> {
  if (!isFirebaseConfigured) {
    throw new Error('Firebase credentials are not configured. Please check your .env file.');
  }

  // Clear any active dev persona first
  localStorage.removeItem(DEV_USER_KEY);

  const credential = await signInWithPopup(auth, googleProvider);
  const fbUser = credential.user;

  const profile = await syncUserProfile({
    uid: fbUser.uid,
    displayName: fbUser.displayName || 'Fordham Student',
    email: fbUser.email || '',
    photoURL: fbUser.photoURL || undefined,
    campus: 'rose-hill',
    createdAt: Date.now(),
  });

  return profile;
}

export async function signOutUser(): Promise<void> {
  localStorage.removeItem(DEV_USER_KEY);
  if (isFirebaseConfigured) {
    await signOut(auth);
  }
}

export async function syncUserProfile(user: UserProfile): Promise<UserProfile> {
  if (!isFirebaseConfigured) return user;

  const userRef = ref(database, `users/${user.uid}`);
  const snapshot = await get(userRef);

  if (snapshot.exists()) {
    const existing = snapshot.val() as UserProfile;
    // Keep existing campus/interests if already saved
    return existing;
  } else {
    await set(userRef, user);
    return user;
  }
}

export async function updateUserCampus(uid: string, campus: 'rose-hill' | 'lincoln-center'): Promise<void> {
  if (!isFirebaseConfigured) return;
  const campusRef = ref(database, `users/${uid}/campus`);
  await set(campusRef, campus);
}

// Dev Persona Switcher Helpers (for testing 2+ users simultaneously)
export function getActiveDevPersona(): UserProfile | null {
  const saved = localStorage.getItem(DEV_USER_KEY);
  if (!saved) return null;
  try {
    return JSON.parse(saved) as UserProfile;
  } catch {
    return null;
  }
}

export function setActiveDevPersona(persona: UserProfile | null) {
  if (persona) {
    localStorage.setItem(DEV_USER_KEY, JSON.stringify(persona));
  } else {
    localStorage.removeItem(DEV_USER_KEY);
  }
}

export function onAuthStateChangedWrapper(
  callback: (user: UserProfile | null, loading: boolean) => void
): () => void {
  // Check if a dev persona is active first
  const devUser = getActiveDevPersona();
  if (devUser) {
    callback(devUser, false);
    return () => {};
  }

  if (!isFirebaseConfigured) {
    callback(null, false);
    return () => {};
  }

  return onAuthStateChanged(auth, async (fbUser: FirebaseUser | null) => {
    if (fbUser) {
      try {
        const userRef = ref(database, `users/${fbUser.uid}`);
        const snapshot = await get(userRef);
        if (snapshot.exists()) {
          callback(snapshot.val() as UserProfile, false);
        } else {
          const newProfile: UserProfile = {
            uid: fbUser.uid,
            displayName: fbUser.displayName || 'Fordham Student',
            email: fbUser.email || '',
            photoURL: fbUser.photoURL || undefined,
            campus: 'rose-hill',
            createdAt: Date.now(),
          };
          await syncUserProfile(newProfile);
          callback(newProfile, false);
        }
      } catch (err) {
        console.error('Failed to load user profile:', err);
        callback({
          uid: fbUser.uid,
          displayName: fbUser.displayName || 'Fordham Student',
          email: fbUser.email || '',
          photoURL: fbUser.photoURL || undefined,
          campus: 'rose-hill',
          createdAt: Date.now(),
        }, false);
      }
    } else {
      callback(null, false);
    }
  });
}
