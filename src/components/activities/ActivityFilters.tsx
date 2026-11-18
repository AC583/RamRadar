import React from 'react';
import { CampusId } from '../../types/campus';
import { ActivityCategory } from '../../types/activity';
import { CATEGORIES } from '../../utils/categories';
import { Search, Map as MapIcon, List as ListIcon, Bookmark } from 'lucide-react';

interface ActivityFiltersProps {
  selectedCampus: CampusId;
  onCampusChange: (campus: CampusId) => void;
  selectedCategory: ActivityCategory | 'all';
  onCategoryChange: (category: ActivityCategory | 'all') => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  viewMode: 'map' | 'list';
  onViewModeChange: (mode: 'map' | 'list') => void;
  filterMyActivities: boolean;
  onToggleMyActivities: (val: boolean) => void;
  isLoggedIn: boolean;
}

export const ActivityFilters: React.FC<ActivityFiltersProps> = ({
  selectedCampus,
  onCampusChange,
  selectedCategory,
  onCategoryChange,
  searchQuery,
  onSearchChange,
  viewMode,
  onViewModeChange,
  filterMyActivities,
  onToggleMyActivities,
  isLoggedIn,
}) => {
  return (
    <div className="bg-white border-b border-slate-200 p-4 space-y-3.5">
      {/* Top Row: Campus Switcher & View Mode Toggle */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Campus Tabs */}
        <div className="flex bg-slate-100 p-1 rounded-xl self-start">
          <button
            onClick={() => onCampusChange('rose-hill')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              selectedCampus === 'rose-hill'
                ? 'bg-white text-fordham-maroon shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Rose Hill (Bronx)
          </button>
          <button
            onClick={() => onCampusChange('lincoln-center')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              selectedCampus === 'lincoln-center'
                ? 'bg-white text-fordham-maroon shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Lincoln Center (Manhattan)
          </button>
        </div>

        {/* View Mode & My Activities Button */}
        <div className="flex items-center gap-2">
          {isLoggedIn && (
            <button
              onClick={() => onToggleMyActivities(!filterMyActivities)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                filterMyActivities
                  ? 'bg-fordham-maroon text-white border-fordham-maroon'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
              }`}
            >
              <Bookmark className="w-3.5 h-3.5" />
              <span>My Activities</span>
            </button>
          )}

          <div className="flex bg-slate-100 p-1 rounded-lg">
            <button
              onClick={() => onViewModeChange('map')}
              title="Map View"
              className={`p-1.5 rounded text-xs font-medium transition-all ${
                viewMode === 'map'
                  ? 'bg-white text-fordham-maroon shadow-sm'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <MapIcon className="w-4 h-4" />
            </button>
            <button
              onClick={() => onViewModeChange('list')}
              title="List View"
              className={`p-1.5 rounded text-xs font-medium transition-all ${
                viewMode === 'list'
                  ? 'bg-white text-fordham-maroon shadow-sm'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <ListIcon className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search activities by title, description, or building..."
          className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-fordham-maroon/20 focus:border-fordham-maroon transition-all"
        />
        {searchQuery && (
          <button
            onClick={() => onSearchChange('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600"
          >
            Clear
          </button>
        )}
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar text-xs">
        <button
          onClick={() => onCategoryChange('all')}
          className={`px-3 py-1.5 rounded-full font-medium transition-all shrink-0 ${
            selectedCategory === 'all'
              ? 'bg-slate-900 text-white'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          All Categories
        </button>

        {Object.entries(CATEGORIES).map(([catKey, meta]) => (
          <button
            key={catKey}
            onClick={() => onCategoryChange(catKey as ActivityCategory)}
            className={`px-3 py-1.5 rounded-full font-medium transition-all shrink-0 flex items-center gap-1.5 ${
              selectedCategory === catKey
                ? 'ring-2 ring-fordham-maroon text-slate-900 font-semibold'
                : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <span
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: meta.pinColor }}
            />
            <span>{meta.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};
