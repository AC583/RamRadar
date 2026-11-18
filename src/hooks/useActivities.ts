import { useState, useEffect, useMemo } from 'react';
import { Activity, ActivityCategory } from '../types/activity';
import { CampusId } from '../types/campus';
import { subscribeToActivities } from '../services/activityService';
import { isActivityActive } from '../utils/dateUtils';

export interface UseActivitiesOptions {
  campus?: CampusId | 'all';
  category?: ActivityCategory | 'all';
  searchQuery?: string;
  hideExpired?: boolean;
}

export function useActivities(options: UseActivitiesOptions = {}) {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    setLoading(true);
    const unsubscribe = subscribeToActivities((items) => {
      setActivities(items);
      setLoading(false);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const filteredActivities = useMemo(() => {
    return activities.filter((act) => {
      // 1. Filter out canceled activities from default discovery feed
      if (act.status === 'canceled') {
        return false;
      }

      // 2. Hide expired activities if requested
      if (options.hideExpired !== false && !isActivityActive(act.startTime, act.endTime)) {
        return false;
      }

      // 3. Campus filter
      if (options.campus && options.campus !== 'all' && act.campus !== options.campus) {
        return false;
      }

      // 4. Category filter
      if (options.category && options.category !== 'all' && act.category !== options.category) {
        return false;
      }

      // 5. Search query filter
      if (options.searchQuery && options.searchQuery.trim() !== '') {
        const query = options.searchQuery.toLowerCase().trim();
        const matchesTitle = act.title.toLowerCase().includes(query);
        const matchesDesc = act.description.toLowerCase().includes(query);
        const matchesLocation = act.location.name.toLowerCase().includes(query);
        const matchesCategory = act.category.toLowerCase().includes(query);

        if (!matchesTitle && !matchesDesc && !matchesLocation && !matchesCategory) {
          return false;
        }
      }

      return true;
    });
  }, [activities, options.campus, options.category, options.searchQuery, options.hideExpired]);

  return {
    activities,
    filteredActivities,
    loading,
    totalCount: activities.length,
    filteredCount: filteredActivities.length,
  };
}
