import React, { useState, useEffect } from 'react';
import { useCampus } from '../hooks/useCampus';
import { useAuth } from '../hooks/useAuth';
import { useActivities } from '../hooks/useActivities';
import { Activity, ActivityCategory } from '../types/activity';
import { CampusMap } from '../components/map/CampusMap';
import { ActivityCard } from '../components/activities/ActivityCard';
import { ActivityDetails } from '../components/activities/ActivityDetails';
import { ActivityFilters } from '../components/activities/ActivityFilters';
import { CreateActivityForm } from '../components/activities/CreateActivityForm';
import { Header } from '../components/layout/Header';
import { seedDemoDataIfEmpty } from '../data/seedData';
import { AlertCircle, Plus, Sparkles, MapPin, Compass } from 'lucide-react';
import { Toaster, toast } from 'sonner';

export const DashboardPage: React.FC = () => {
  const { campusId, campus, setCampusId } = useCampus();
  const {
    user,
    loading: authLoading,
    signIn,
    signOut,
    selectDevPersona,
    devPersonas,
    isDevUser,
  } = useAuth();

  const [selectedCategory, setSelectedCategory] = useState<ActivityCategory | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [viewMode, setViewMode] = useState<'map' | 'list'>('map');
  const [filterMyActivities, setFilterMyActivities] = useState<boolean>(false);
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);
  const [isCreateOpen, setIsCreateOpen] = useState<boolean>(false);

  // Auto-seed demo data once on first launch if Firebase database is empty
  useEffect(() => {
    seedDemoDataIfEmpty().then((seeded) => {
      if (seeded) {
        toast.info('Loaded Fordham campus demonstration activities!');
      }
    });
  }, []);

  // Fetch and filter activities
  const { filteredActivities, loading: activitiesLoading, totalCount } = useActivities({
    campus: campusId,
    category: selectedCategory,
    searchQuery: searchQuery,
  });

  // If "My Activities" filter is active, only show activities where user is host or participant
  const displayedActivities = filterMyActivities && user
    ? filteredActivities.filter((a) => a.hostId === user.uid)
    : filteredActivities;

  // Keep selectedActivity in sync with fresh data
  useEffect(() => {
    if (selectedActivity) {
      const updated = displayedActivities.find((a) => a.id === selectedActivity.id);
      if (updated) {
        setSelectedActivity(updated);
      }
    }
  }, [displayedActivities]);

  return (
    <div className="min-h-screen flex flex-col bg-slate-100">
      <Toaster position="top-right" richColors />

      {/* Global Navigation Header */}
      <Header
        currentUser={user}
        selectedCampus={campusId}
        onCampusChange={setCampusId}
        onOpenCreate={() => {
          if (!user) {
            toast.error('Please sign in or choose a Dev Persona to post an activity.');
            return;
          }
          setIsCreateOpen(true);
        }}
        onSignIn={async () => {
          try {
            await signIn();
            toast.success('Signed in successfully!');
          } catch (err: any) {
            toast.error(err.message || 'Failed to sign in with Google.');
          }
        }}
        onSignOut={async () => {
          await signOut();
          toast.info('Signed out.');
        }}
        onSelectDevPersona={(persona) => {
          selectDevPersona(persona);
          if (persona) {
            toast.success(`Switched active user to ${persona.displayName}`);
          }
        }}
        devPersonas={devPersonas}
        isDevUser={isDevUser}
      />

      {/* Filters & Control Bar */}
      <ActivityFilters
        selectedCampus={campusId}
        onCampusChange={setCampusId}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        filterMyActivities={filterMyActivities}
        onToggleMyActivities={setFilterMyActivities}
        isLoggedIn={Boolean(user)}
      />

      {/* Main Workspace Layout: 3 Columns on desktop */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 flex flex-col lg:flex-row gap-4 overflow-hidden">
        {/* Left: Activity Discovery Feed (Cards List) */}
        <section
          className={`lg:w-96 flex flex-col bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden ${
            viewMode === 'map' ? 'hidden lg:flex' : 'flex w-full'
          }`}
          style={{ maxHeight: 'calc(100vh - 175px)' }}
        >
          {/* Feed Header */}
          <div className="p-3.5 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                {filterMyActivities ? 'My Activities' : 'Live Gatherings'}
              </span>
              <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-fordham-maroon/10 text-fordham-maroon">
                {displayedActivities.length}
              </span>
            </div>

            <button
              onClick={() => {
                if (!user) {
                  toast.error('Sign in to post an activity.');
                  return;
                }
                setIsCreateOpen(true);
              }}
              className="text-xs font-semibold text-fordham-maroon hover:text-fordham-maroonDark flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>New</span>
            </button>
          </div>

          {/* Cards Scroll Container */}
          <div className="p-3 overflow-y-auto space-y-3 flex-1">
            {activitiesLoading ? (
              <div className="py-12 flex flex-col items-center justify-center text-slate-400 text-xs">
                <div className="w-6 h-6 border-2 border-fordham-maroon border-t-transparent rounded-full animate-spin mb-2" />
                <span>Syncing campus activities...</span>
              </div>
            ) : displayedActivities.length === 0 ? (
              <div className="py-12 px-4 text-center">
                <Compass className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                <p className="text-sm font-semibold text-slate-700">No activities found</p>
                <p className="text-xs text-slate-500 mt-1">
                  {searchQuery || selectedCategory !== 'all'
                    ? 'Try clearing your filters or search query.'
                    : `Be the first to organize a gathering at ${campus.shortName}!`}
                </p>
                <button
                  onClick={() => {
                    if (!user) {
                      toast.error('Sign in to post an activity.');
                      return;
                    }
                    setIsCreateOpen(true);
                  }}
                  className="mt-4 inline-flex items-center gap-1.5 px-3 py-1.5 bg-fordham-maroon text-white text-xs font-semibold rounded-lg shadow-sm"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Post Gathering</span>
                </button>
              </div>
            ) : (
              displayedActivities.map((activity) => (
                <ActivityCard
                  key={activity.id}
                  activity={activity}
                  isSelected={selectedActivity?.id === activity.id}
                  onSelect={(act) => setSelectedActivity(act)}
                />
              ))
            )}
          </div>
        </section>

        {/* Center: Interactive Campus Map View */}
        <section
          className={`flex-1 flex flex-col min-h-[450px] ${
            viewMode === 'list' ? 'hidden lg:flex' : 'flex'
          }`}
          style={{ minHeight: 'calc(100vh - 175px)' }}
        >
          <CampusMap
            campus={campus}
            activities={displayedActivities}
            selectedActivityId={selectedActivity?.id}
            onSelectActivity={(act) => setSelectedActivity(act)}
          />
        </section>

        {/* Right: Selected Activity Detail Side Panel */}
        {selectedActivity && (
          <aside
            className="fixed inset-y-0 right-0 z-40 w-full sm:w-[420px] lg:static lg:w-96 lg:z-auto bg-white rounded-2xl border border-slate-200 shadow-xl lg:shadow-sm overflow-hidden flex flex-col animate-in slide-in-from-right duration-200"
            style={{ maxHeight: 'calc(100vh - 175px)' }}
          >
            <ActivityDetails
              activity={selectedActivity}
              currentUser={user}
              onClose={() => setSelectedActivity(null)}
              onSignInRequired={async () => {
                try {
                  await signIn();
                  toast.success('Signed in successfully!');
                } catch (err: any) {
                  toast.error(err.message || 'Failed to sign in.');
                }
              }}
              onActivityUpdated={() => {
                // Trigger re-render or notification
              }}
            />
          </aside>
        )}
      </main>

      {/* Create Activity Form Modal */}
      {user && (
        <CreateActivityForm
          initialCampus={campusId}
          currentUser={user}
          isOpen={isCreateOpen}
          onClose={() => setIsCreateOpen(false)}
          onCreated={(newActivityId) => {
            // Find and select newly created activity
            const newlyCreated = displayedActivities.find((a) => a.id === newActivityId);
            if (newlyCreated) {
              setSelectedActivity(newlyCreated);
            }
          }}
        />
      )}
    </div>
  );
};
