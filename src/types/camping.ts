export interface Destination {
  id: string;
  name: string;
  address: string;
  time: string;
  type: 'destination' | 'meeting' | 'return';
  arrived?: boolean;
}

export interface ChecklistItem {
  id: string;
  title: string;
  completed: boolean;
}

export interface TripDay {
  id: string;
  date: string;
  destinations: Destination[];
  checklist: ChecklistItem[];
}

export type GearCategory = 'tent' | 'cooking' | 'food' | 'emergency';

export interface GearItem {
  id: string;
  name: string;
  category: GearCategory;
  quantity: number;
  checked: boolean;
  claimedBy?: string;
}

export interface CampInfo {
  id: string;
  name: string;
  waterSource: string;
  toilet: string;
  parking: string;
  signal: string;
  fireRule: string;
  notes: string;
}

export interface WeatherRecord {
  id: string;
  wind: string;
  rain: string;
  nightTemp: string;
  fireSafe: string;
  timestamp: string;
}

export interface Member {
  id: string;
  name: string;
  phone: string;
  role: string;
  confirmed?: boolean;
}

export interface Vehicle {
  id: string;
  brand: string;
  plate: string;
  driver: string;
  seats: number;
  passengers: string[];
}

export interface EmergencyContact {
  id: string;
  name: string;
  phone: string;
  relation: string;
}

export interface CostItem {
  id: string;
  name: string;
  amount: number;
  splitMemberIds?: string[];
}

export interface PhotoItem {
  id: string;
  url: string;
}

export interface PlanSnapshot {
  tripDays: TripDay[];
  gearList: GearItem[];
  campInfo: CampInfo;
  members: Member[];
  vehicles: Vehicle[];
  emergencyContacts: EmergencyContact[];
  estimatedCost: CostItem[];
  departureSnapshot?: {
    members: Member[];
    vehicles: Vehicle[];
    gearClaimedBy: Record<string, string[]>;
  };
}

export interface TripReview {
  id: string;
  tripName: string;
  date: string;
  photos: PhotoItem[];
  actualCost: CostItem[];
  totalCost: number;
  missedItems: string[];
  notes: string;
  planSnapshot?: PlanSnapshot;
  archived?: boolean;
}

export interface CampingState {
  tripName: string;
  tripDays: TripDay[];
  gearList: GearItem[];
  campInfo: CampInfo;
  weatherRecords: WeatherRecord[];
  members: Member[];
  vehicles: Vehicle[];
  emergencyContacts: EmergencyContact[];
  estimatedCost: CostItem[];
  review: TripReview;
  pastTrips: TripReview[];
}
