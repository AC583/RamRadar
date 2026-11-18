import { ref, get, set } from 'firebase/database';
import { database, isFirebaseConfigured } from '../services/firebase';
import { Activity } from '../types/activity';
import { addHours, addDays } from 'date-fns';

export const SAMPLE_ACTIVITIES: Omit<Activity, 'id' | 'createdAt'>[] = [
  // Rose Hill Activities
  {
    title: 'CISC 2200 Data Structures Study Group',
    description: 'Reviewing binary search trees, graph traversals, and dynamic programming for the upcoming exam. Bring your notes and laptop!',
    category: 'study',
    campus: 'rose-hill',
    location: {
      name: 'Walsh Family Library (Room 214)',
      latitude: 40.8598,
      longitude: -73.8847,
    },
    hostId: 'dev-alex-rh',
    hostName: 'Alex Rivera',
    hostPhotoURL: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
    startTime: addHours(new Date(), 2).getTime(),
    endTime: addHours(new Date(), 4).getTime(),
    maxParticipants: 6,
    status: 'active',
    participantCount: 3,
  },
  {
    title: 'Pickup Basketball Run (5v5)',
    description: 'Casual half-court / full-court pickup games at Lombardi. All skill levels welcome, just bring sneakers and a water bottle.',
    category: 'sports',
    campus: 'rose-hill',
    location: {
      name: 'Vince T. Lombardi Center (Court 2)',
      latitude: 40.8623,
      longitude: -73.8872,
    },
    hostId: 'dev-sam-rh',
    hostName: 'Samira Patel',
    hostPhotoURL: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
    startTime: addHours(new Date(), 5).getTime(),
    endTime: addHours(new Date(), 7).getTime(),
    maxParticipants: 10,
    status: 'active',
    participantCount: 7,
  },
  {
    title: 'Commuter Student Lunch & Social',
    description: 'Grabbing food at McShane and hanging out before afternoon classes. Great chance to meet other commuter Rams!',
    category: 'social',
    campus: 'rose-hill',
    location: {
      name: 'McShane Campus Center (Marketplace Lounge)',
      latitude: 40.8601,
      longitude: -73.8864,
    },
    hostId: 'dev-alex-rh',
    hostName: 'Alex Rivera',
    hostPhotoURL: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
    startTime: addDays(new Date(), 1).getTime(),
    endTime: addDays(addHours(new Date(), 2), 1).getTime(),
    maxParticipants: 12,
    status: 'active',
    participantCount: 4,
  },
  {
    title: 'Gabelli Consulting Case Prep',
    description: 'Practicing market sizing and profitability framework cases for upcoming internship interviews. Bring a notebook!',
    category: 'academic',
    campus: 'rose-hill',
    location: {
      name: 'Hughes Hall (Gabelli Room 102)',
      latitude: 40.8600,
      longitude: -73.8858,
    },
    hostId: 'dev-alex-rh',
    hostName: 'Alex Rivera',
    hostPhotoURL: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
    startTime: addHours(new Date(), 24).getTime(),
    maxParticipants: 4,
    status: 'active',
    participantCount: 2,
  },

  // Lincoln Center Activities
  {
    title: 'Quinn Library Quiet Study Session',
    description: 'Focus session for finals and paper writing. Pomodoro technique: 50 min work, 10 min break.',
    category: 'study',
    campus: 'lincoln-center',
    location: {
      name: 'Quinn Library (2nd Floor Quiet Zone)',
      latitude: 40.7711,
      longitude: -73.9840,
    },
    hostId: 'dev-taylor-lc',
    hostName: 'Taylor Chen',
    hostPhotoURL: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    startTime: addHours(new Date(), 3).getTime(),
    endTime: addHours(new Date(), 6).getTime(),
    maxParticipants: 5,
    status: 'active',
    participantCount: 2,
  },
  {
    title: 'Afternoon Coffee & Central Park Walk',
    description: 'Taking a 45-minute breather between afternoon lectures. Meeting on the plaza, grabbing iced coffee, and heading toward Columbus Circle.',
    category: 'social',
    campus: 'lincoln-center',
    location: {
      name: 'Outdoor Plaza & Green Space',
      latitude: 40.7713,
      longitude: -73.9839,
    },
    hostId: 'dev-taylor-lc',
    hostName: 'Taylor Chen',
    hostPhotoURL: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    startTime: addHours(new Date(), 6).getTime(),
    maxParticipants: 8,
    status: 'active',
    participantCount: 3,
  },
  {
    title: 'Law & Ethics Society Discussion',
    description: 'Informal open forum on emerging AI policies and copyright law. Coffee and snacks will be provided.',
    category: 'clubs',
    campus: 'lincoln-center',
    location: {
      name: 'McKeon Hall & Law Building (Atrium)',
      latitude: 40.7717,
      longitude: -73.9843,
    },
    hostId: 'dev-taylor-lc',
    hostName: 'Taylor Chen',
    hostPhotoURL: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    startTime: addDays(new Date(), 1).getTime(),
    maxParticipants: 15,
    status: 'active',
    participantCount: 8,
  },
];

export async function seedDemoDataIfEmpty(): Promise<boolean> {
  if (!isFirebaseConfigured) return false;

  try {
    const activitiesRef = ref(database, 'activities');
    const snapshot = await get(activitiesRef);

    if (snapshot.exists() && Object.keys(snapshot.val()).length > 0) {
      // Already has data
      return false;
    }

    // Seed activities
    for (let i = 0; i < SAMPLE_ACTIVITIES.length; i++) {
      const act = SAMPLE_ACTIVITIES[i];
      const newId = `demo-act-${i + 1}`;
      const activityData: Activity = {
        ...act,
        id: newId,
        createdAt: Date.now() - (i * 3600000),
      };

      await set(ref(database, `activities/${newId}`), activityData);

      // Register host in participants
      await set(ref(database, `participants/${newId}/${act.hostId}`), {
        joinedAt: Date.now() - 3600000,
        displayName: act.hostName,
        photoURL: act.hostPhotoURL,
      });
    }

    return true;
  } catch (err) {
    console.error('Failed to seed demo data:', err);
    return false;
  }
}
