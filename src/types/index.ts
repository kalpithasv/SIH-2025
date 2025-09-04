export interface Tourist {
  id: string;
  name: string;
  nationality: string;
  passportNumber: string;
  phoneNumber: string;
  email: string;
  arrivalDate: string;
  departureDate: string;
  currentLocation: {
    lat: number;
    lng: number;
    address: string;
  };
  safetyScore: number;
  status: 'safe' | 'warning' | 'danger' | 'missing';
  lastSeen: string;
  travelHistory: LocationHistory[];
  emergencyContacts: EmergencyContact[];
  isTrackingEnabled: boolean;
}

export interface LocationHistory {
  id: string;
  lat: number;
  lng: number;
  address: string;
  timestamp: string;
  safetyScore: number;
  riskLevel: 'low' | 'medium' | 'high';
}

export interface EmergencyContact {
  id: string;
  name: string;
  relationship: string;
  phoneNumber: string;
  email: string;
}

export interface SafetyZone {
  id: string;
  name: string;
  type: 'safe' | 'warning' | 'restricted';
  coordinates: [number, number][];
  description: string;
  riskLevel: number;
}

export interface DashboardStats {
  totalTourists: number;
  safeTourists: number;
  warningTourists: number;
  dangerTourists: number;
  missingTourists: number;
  averageSafetyScore: number;
  activeAlerts: number;
  resolvedAlerts: number;
}

export interface Alert {
  id: string;
  touristId: string;
  touristName: string;
  type: 'panic' | 'geofence' | 'anomaly' | 'missing';
  severity: 'low' | 'medium' | 'high' | 'critical';
  message: string;
  timestamp: string;
  location: {
    lat: number;
    lng: number;
    address: string;
  };
  status: 'active' | 'investigating' | 'resolved';
  assignedTo?: string;
}
