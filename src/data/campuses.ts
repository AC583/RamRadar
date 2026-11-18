import { Campus } from '../types/campus';

export const CAMPUSES: Record<string, Campus> = {
  'rose-hill': {
    id: 'rose-hill',
    name: 'Rose Hill (Bronx)',
    shortName: 'Rose Hill',
    center: {
      latitude: 40.8610,
      longitude: -73.8855,
    },
    initialZoom: 16,
    description: 'Fordham’s historic 85-acre campus in the Bronx, adjacent to the New York Botanical Garden.',
    address: '441 E Fordham Rd, Bronx, NY 10458',
  },
  'lincoln-center': {
    id: 'lincoln-center',
    name: 'Lincoln Center (Manhattan)',
    shortName: 'Lincoln Center',
    center: {
      latitude: 40.7712,
      longitude: -73.9843,
    },
    initialZoom: 16.5,
    description: 'Fordham’s vibrant Manhattan campus located next to Lincoln Center for the Performing Arts and Central Park.',
    address: '113 W 60th St, New York, NY 10023',
  },
};

export const DEFAULT_CAMPUS_ID = 'rose-hill';
