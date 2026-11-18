import { ActivityCategory } from '../types/activity';

export interface CategoryMeta {
  id: ActivityCategory;
  label: string;
  badgeClass: string;
  pinColor: string;
  accentBg: string;
  description: string;
}

export const CATEGORIES: Record<ActivityCategory, CategoryMeta> = {
  study: {
    id: 'study',
    label: 'Study Group',
    badgeClass: 'bg-blue-100 text-blue-800 border-blue-200',
    pinColor: '#2563eb',
    accentBg: '#dbeafe',
    description: 'Study sessions, homework help, exam prep',
  },
  social: {
    id: 'social',
    label: 'Social & Food',
    badgeClass: 'bg-amber-100 text-amber-800 border-amber-200',
    pinColor: '#d97706',
    accentBg: '#fef3c7',
    description: 'Coffee, dining, casual hangouts, chats',
  },
  sports: {
    id: 'sports',
    label: 'Sports & Rec',
    badgeClass: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    pinColor: '#059669',
    accentBg: '#d1fae5',
    description: 'Pickup basketball, soccer, gym sessions, outdoor recreation',
  },
  clubs: {
    id: 'clubs',
    label: 'Clubs & Orgs',
    badgeClass: 'bg-purple-100 text-purple-800 border-purple-200',
    pinColor: '#7c3aed',
    accentBg: '#ede9fe',
    description: 'Student organization meetings, recruitment, rehearsals',
  },
  academic: {
    id: 'academic',
    label: 'Academic',
    badgeClass: 'bg-cyan-100 text-cyan-800 border-cyan-200',
    pinColor: '#0891b2',
    accentBg: '#cffafe',
    description: 'Workshops, research presentations, lectures, career panels',
  },
  'campus-events': {
    id: 'campus-events',
    label: 'Campus Events',
    badgeClass: 'bg-rose-100 text-rose-800 border-rose-200',
    pinColor: '#861f41', // Fordham Maroon
    accentBg: '#ffe4e6',
    description: 'Official university events, traditions, spirit rallies',
  },
  other: {
    id: 'other',
    label: 'Other',
    badgeClass: 'bg-slate-100 text-slate-800 border-slate-200',
    pinColor: '#64748b',
    accentBg: '#f1f5f9',
    description: 'Miscellaneous student gatherings and activities',
  },
};

export const CATEGORY_LIST = Object.values(CATEGORIES);
