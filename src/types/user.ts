import { CampusId } from './campus';

export interface UserProfile {
  uid: string;
  displayName: string;
  email: string;
  photoURL?: string;
  campus?: CampusId;
  interests?: string[];
  createdAt: number;
}
