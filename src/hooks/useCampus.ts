import { useState, useEffect } from 'react';
import { CampusId, Campus } from '../types/campus';
import { CAMPUSES, DEFAULT_CAMPUS_ID } from '../data/campuses';

const CAMPUS_STORAGE_KEY = 'ramradar_active_campus';

export function useCampus() {
  const [campusId, setCampusId] = useState<CampusId>(() => {
    const saved = localStorage.getItem(CAMPUS_STORAGE_KEY) as CampusId;
    return saved && CAMPUSES[saved] ? saved : DEFAULT_CAMPUS_ID;
  });

  useEffect(() => {
    localStorage.setItem(CAMPUS_STORAGE_KEY, campusId);
  }, [campusId]);

  const campus = CAMPUSES[campusId];

  return {
    campusId,
    campus,
    setCampusId,
    campuses: CAMPUSES,
  };
}
