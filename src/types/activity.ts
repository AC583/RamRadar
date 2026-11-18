import { CampusId } from './campus';

export type ActivityCategory =
  | 'study'
  | 'social'
  | 'sports'
  | 'clubs'
  | 'academic'
  | 'campus-events'
  | 'other';

export type ActivityStatus =
  | 'active'
  | 'full'
  | 'canceled'
  | 'completed'
  | 'expired';

export interface ActivityLocation {
  name: string;
  latitude: number;
  longitude: number;
}

export interface Activity {
  id: string;
  title: string;
  description: string;
  category: ActivityCategory;
  campus: CampusId;
  location: ActivityLocation;
  hostId: string;
  hostName?: string;
  hostPhotoURL?: string;
  startTime: number;
  endTime?: number;
  maxParticipants?: number;
  status: ActivityStatus;
  createdAt: number;
  participantCount?: number;
}

export interface ParticipantRecord {
  joinedAt: number;
  displayName?: string;
  photoURL?: string;
}

export type ActivityParticipants = Record<string, ParticipantRecord>;

export interface ActivityFilterOptions {
  campus?: CampusId | 'all';
  category?: ActivityCategory | 'all';
  searchQuery?: string;
  onlyAvailable?: boolean;
}
