export type CampusId = 'rose-hill' | 'lincoln-center';

export interface Campus {
  id: CampusId;
  name: string;
  shortName: string;
  center: {
    latitude: number;
    longitude: number;
  };
  initialZoom: number;
  description: string;
  address: string;
}

export interface CampusLocation {
  id: string;
  name: string;
  campus: CampusId;
  latitude: number;
  longitude: number;
  category?: string;
  description?: string;
}
