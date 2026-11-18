import React, { useEffect, useRef, useState } from 'react';
import maplibregl, { Map as MapLibreMap, Marker, NavigationControl } from 'maplibre-gl';
import { Campus } from '../../types/campus';
import { Activity } from '../../types/activity';
import { CATEGORIES } from '../../utils/categories';
import { formatActivityTime } from '../../utils/dateUtils';
import { Users, AlertCircle, RefreshCw } from 'lucide-react';

interface CampusMapProps {
  campus: Campus;
  activities: Activity[];
  selectedActivityId?: string | null;
  onSelectActivity: (activity: Activity) => void;
}

export const CampusMap: React.FC<CampusMapProps> = ({
  campus,
  activities,
  selectedActivityId,
  onSelectActivity,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<MapLibreMap | null>(null);
  const markersRef = useRef<Record<string, Marker>>({});
  const [mapError, setMapError] = useState<string | null>(null);
  const [mapLoaded, setMapLoaded] = useState<boolean>(false);

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    try {
      const map = new maplibregl.Map({
        container: mapContainerRef.current,
        style: 'https://tiles.openfreemap.org/styles/liberty',
        center: [campus.center.longitude, campus.center.latitude],
        zoom: campus.initialZoom,
        maxZoom: 19,
        minZoom: 14,
        attributionControl: {
          compact: true,
        },
      });

      map.addControl(new NavigationControl({ showCompass: false }), 'top-right');

      map.on('load', () => {
        setMapLoaded(true);
      });

      map.on('error', (e) => {
        // Only trigger critical fallback if tile source fails completely
        if (e.error && e.error.message && e.error.message.includes('source')) {
          console.warn('Map tile notice:', e.error);
        }
      });

      mapInstanceRef.current = map;

      return () => {
        map.remove();
        mapInstanceRef.current = null;
      };
    } catch (err: any) {
      console.error('Failed to initialize map:', err);
      setMapError('Interactive map could not load. You can continue using the Activity List view.');
    }
  }, []);

  // Pan / Fly to new campus when changed
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    map.flyTo({
      center: [campus.center.longitude, campus.center.latitude],
      zoom: campus.initialZoom,
      essential: true,
      speed: 1.2,
    });
  }, [campus]);

  // Update Markers when activities change or selectedActivityId changes
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !mapLoaded) return;

    // Clear previous markers that are no longer in activities
    const currentActivityIds = new Set(activities.map((a) => a.id));
    Object.keys(markersRef.current).forEach((id) => {
      if (!currentActivityIds.has(id)) {
        markersRef.current[id].remove();
        delete markersRef.current[id];
      }
    });

    // Add or update markers
    activities.forEach((activity) => {
      const isSelected = selectedActivityId === activity.id;
      const categoryMeta = CATEGORIES[activity.category] || CATEGORIES.other;

      if (markersRef.current[activity.id]) {
        // Marker already exists, update styling if selection changed
        const el = markersRef.current[activity.id].getElement();
        if (isSelected) {
          el.classList.add('scale-125', 'ring-4', 'ring-fordham-maroon', 'z-30');
        } else {
          el.classList.remove('scale-125', 'ring-4', 'ring-fordham-maroon', 'z-30');
        }
        return;
      }

      // Create new marker DOM element
      const markerEl = document.createElement('div');
      markerEl.className = `group cursor-pointer transition-all duration-200 transform hover:scale-110 flex items-center justify-center ${
        isSelected ? 'scale-125 ring-4 ring-rose-900 z-30' : ''
      }`;
      markerEl.style.width = '38px';
      markerEl.style.height = '38px';

      markerEl.innerHTML = `
        <div style="background-color: ${categoryMeta.pinColor};" class="w-9 h-9 rounded-full shadow-lg border-2 border-white flex items-center justify-center text-white relative">
          <span class="text-xs font-bold leading-none">${activity.participantCount || 1}</span>
          <div class="absolute -bottom-1 w-2 h-2 rotate-45 border-r border-b border-white" style="background-color: ${categoryMeta.pinColor};"></div>
        </div>
      `;

      markerEl.addEventListener('click', (e) => {
        e.stopPropagation();
        onSelectActivity(activity);
      });

      const marker = new Marker({ element: markerEl, anchor: 'bottom' })
        .setLngLat([activity.location.longitude, activity.location.latitude])
        .addTo(map);

      markersRef.current[activity.id] = marker;
    });
  }, [activities, selectedActivityId, mapLoaded, onSelectActivity]);

  const handleResetView = () => {
    if (!mapInstanceRef.current) return;
    mapInstanceRef.current.flyTo({
      center: [campus.center.longitude, campus.center.latitude],
      zoom: campus.initialZoom,
      essential: true,
    });
  };

  if (mapError) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center p-8 bg-slate-100 text-slate-700 text-center">
        <AlertCircle className="w-12 h-12 text-amber-600 mb-3" />
        <h3 className="text-lg font-semibold text-slate-800">Map View Unavailable</h3>
        <p className="text-sm text-slate-600 max-w-md mt-1 mb-4">{mapError}</p>
        <p className="text-xs text-slate-500">Please switch to the List View on the side to browse all active campus activities.</p>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full min-h-[400px] overflow-hidden rounded-xl border border-slate-200 bg-slate-100 shadow-sm">
      <div ref={mapContainerRef} className="w-full h-full min-h-[400px]" />

      {/* Floating Map Overlay Controls */}
      <div className="absolute top-4 left-4 z-10 flex items-center gap-2">
        <div className="bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-lg shadow-sm border border-slate-200 text-xs font-medium text-slate-700 flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span>{campus.name}</span>
        </div>

        <button
          onClick={handleResetView}
          title="Reset map to campus center"
          className="bg-white/95 backdrop-blur-sm hover:bg-slate-50 text-slate-700 p-2 rounded-lg shadow-sm border border-slate-200 transition-colors"
        >
          <RefreshCw className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Map Legend */}
      <div className="absolute bottom-4 left-4 z-10 hidden sm:flex items-center gap-2 bg-white/90 backdrop-blur-sm px-3 py-2 rounded-lg shadow-sm border border-slate-200 text-xs">
        <span className="text-slate-500 font-medium">Pins:</span>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-600"></span>
            <span className="text-slate-600">Study</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
            <span className="text-slate-600">Social</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-600"></span>
            <span className="text-slate-600">Sports</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-700"></span>
            <span className="text-slate-600">Events</span>
          </div>
        </div>
      </div>
    </div>
  );
};
