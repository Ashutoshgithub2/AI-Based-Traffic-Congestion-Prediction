export interface Location {
  lat: number;
  lng: number;
}

export interface RouteInfo {
  id: string;
  name: string;
  origin: Location;
  destination: Location;
  isFavorite: boolean;
  lastUsed?: Date;
}

export interface TrafficPrediction {
  id: string;
  routeId: string;
  timestamp: Date;
  congestionLevel: CongestionLevel;
  predictedDuration: number;
  actualDuration?: number;
  confidence: number;
}

export enum CongestionLevel {
  LOW = "low",
  MODERATE = "moderate",
  HIGH = "high",
  SEVERE = "severe"
}

export interface RouteAlternative {
  id: string;
  name: string;
  origin: Location;
  destination: Location;
  duration: number;
  distance: number;
  congestionLevel: CongestionLevel;
  savingsInMinutes: number;
}

export interface PredictionTimeframe {
  value: number;
  unit: "minutes" | "hours";
  label: string;
}

export interface UserPreferences {
  darkMode: boolean;
  defaultTimeframe: PredictionTimeframe;
  notificationsEnabled: boolean;
  favoriteRoutes: string[];
}

export interface MapOptions {
  zoom: number;
  center: Location;
  mapTypeId: string;
  styles?: google.maps.MapTypeStyle[];
}