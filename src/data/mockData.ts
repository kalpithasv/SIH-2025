import { Tourist, DashboardStats, Alert, SafetyZone } from '../types';

export const mockTourists: Tourist[] = [
  {
    id: '1',
    name: 'John Smith',
    nationality: 'USA',
    passportNumber: 'US123456789',
    phoneNumber: '+1-555-0123',
    email: 'john.smith@email.com',
    arrivalDate: '2024-01-15',
    departureDate: '2024-01-25',
    currentLocation: {
      lat: 28.6139,
      lng: 77.2090,
      address: 'Red Fort, Delhi'
    },
    safetyScore: 85,
    status: 'safe',
    lastSeen: '2024-01-20T10:30:00Z',
    travelHistory: [
      {
        id: '1',
        lat: 28.6139,
        lng: 77.2090,
        address: 'Red Fort, Delhi',
        timestamp: '2024-01-20T10:30:00Z',
        safetyScore: 85,
        riskLevel: 'low'
      },
      {
        id: '2',
        lat: 28.5355,
        lng: 77.3910,
        address: 'India Gate, Delhi',
        timestamp: '2024-01-20T08:15:00Z',
        safetyScore: 90,
        riskLevel: 'low'
      }
    ],
    emergencyContacts: [
      {
        id: '1',
        name: 'Jane Smith',
        relationship: 'Spouse',
        phoneNumber: '+1-555-0124',
        email: 'jane.smith@email.com'
      }
    ],
    isTrackingEnabled: true
  },
  {
    id: '2',
    name: 'Maria Garcia',
    nationality: 'Spain',
    passportNumber: 'ES987654321',
    phoneNumber: '+34-666-789012',
    email: 'maria.garcia@email.com',
    arrivalDate: '2024-01-18',
    departureDate: '2024-01-28',
    currentLocation: {
      lat: 19.0760,
      lng: 72.8777,
      address: 'Gateway of India, Mumbai'
    },
    safetyScore: 72,
    status: 'warning',
    lastSeen: '2024-01-20T09:45:00Z',
    travelHistory: [
      {
        id: '3',
        lat: 19.0760,
        lng: 72.8777,
        address: 'Gateway of India, Mumbai',
        timestamp: '2024-01-20T09:45:00Z',
        safetyScore: 72,
        riskLevel: 'medium'
      }
    ],
    emergencyContacts: [
      {
        id: '2',
        name: 'Carlos Garcia',
        relationship: 'Brother',
        phoneNumber: '+34-666-789013',
        email: 'carlos.garcia@email.com'
      }
    ],
    isTrackingEnabled: true
  },
  {
    id: '3',
    name: 'Ahmed Hassan',
    nationality: 'Egypt',
    passportNumber: 'EG456789123',
    phoneNumber: '+20-100-1234567',
    email: 'ahmed.hassan@email.com',
    arrivalDate: '2024-01-12',
    departureDate: '2024-01-22',
    currentLocation: {
      lat: 12.9716,
      lng: 77.5946,
      address: 'Cubbon Park, Bangalore'
    },
    safetyScore: 45,
    status: 'danger',
    lastSeen: '2024-01-19T14:20:00Z',
    travelHistory: [
      {
        id: '4',
        lat: 12.9716,
        lng: 77.5946,
        address: 'Cubbon Park, Bangalore',
        timestamp: '2024-01-19T14:20:00Z',
        safetyScore: 45,
        riskLevel: 'high'
      }
    ],
    emergencyContacts: [
      {
        id: '3',
        name: 'Fatima Hassan',
        relationship: 'Sister',
        phoneNumber: '+20-100-1234568',
        email: 'fatima.hassan@email.com'
      }
    ],
    isTrackingEnabled: false
  },
  {
    id: '4',
    name: 'Sarah Johnson',
    nationality: 'Canada',
    passportNumber: 'CA789123456',
    phoneNumber: '+1-416-555-0199',
    email: 'sarah.johnson@email.com',
    arrivalDate: '2024-01-10',
    departureDate: '2024-01-20',
    currentLocation: {
      lat: 0,
      lng: 0,
      address: 'Unknown'
    },
    safetyScore: 0,
    status: 'missing',
    lastSeen: '2024-01-18T16:30:00Z',
    travelHistory: [
      {
        id: '5',
        lat: 26.9124,
        lng: 75.7873,
        address: 'Hawa Mahal, Jaipur',
        timestamp: '2024-01-18T16:30:00Z',
        safetyScore: 60,
        riskLevel: 'medium'
      }
    ],
    emergencyContacts: [
      {
        id: '4',
        name: 'Michael Johnson',
        relationship: 'Father',
        phoneNumber: '+1-416-555-0200',
        email: 'michael.johnson@email.com'
      }
    ],
    isTrackingEnabled: true
  }
];

export const mockDashboardStats: DashboardStats = {
  totalTourists: 4,
  safeTourists: 1,
  warningTourists: 1,
  dangerTourists: 1,
  missingTourists: 1,
  averageSafetyScore: 50.5,
  activeAlerts: 3,
  resolvedAlerts: 12
};

export const mockAlerts: Alert[] = [
  {
    id: '1',
    touristId: '3',
    touristName: 'Ahmed Hassan',
    type: 'anomaly',
    severity: 'high',
    message: 'Unusual movement pattern detected - prolonged inactivity',
    timestamp: '2024-01-20T11:00:00Z',
    location: {
      lat: 12.9716,
      lng: 77.5946,
      address: 'Cubbon Park, Bangalore'
    },
    status: 'active',
    assignedTo: 'Officer Rajesh Kumar'
  },
  {
    id: '2',
    touristId: '4',
    touristName: 'Sarah Johnson',
    type: 'missing',
    severity: 'critical',
    message: 'Tourist has been missing for 48+ hours',
    timestamp: '2024-01-20T10:30:00Z',
    location: {
      lat: 26.9124,
      lng: 75.7873,
      address: 'Hawa Mahal, Jaipur'
    },
    status: 'investigating',
    assignedTo: 'Inspector Priya Sharma'
  },
  {
    id: '3',
    touristId: '2',
    touristName: 'Maria Garcia',
    type: 'geofence',
    severity: 'medium',
    message: 'Entered high-risk zone - Dharavi area',
    timestamp: '2024-01-20T09:45:00Z',
    location: {
      lat: 19.0760,
      lng: 72.8777,
      address: 'Gateway of India, Mumbai'
    },
    status: 'active'
  }
];

export const mockSafetyZones: SafetyZone[] = [
  {
    id: '1',
    name: 'Delhi Heritage Zone',
    type: 'safe',
    coordinates: [[28.6, 77.1], [28.7, 77.1], [28.7, 77.3], [28.6, 77.3]],
    description: 'Safe tourist area with high police presence',
    riskLevel: 1
  },
  {
    id: '2',
    name: 'Mumbai Dharavi Area',
    type: 'restricted',
    coordinates: [[19.0, 72.8], [19.1, 72.8], [19.1, 72.9], [19.0, 72.9]],
    description: 'High-risk area - restricted for tourists',
    riskLevel: 9
  },
  {
    id: '3',
    name: 'Bangalore Tech Corridor',
    type: 'warning',
    coordinates: [[12.9, 77.5], [13.0, 77.5], [13.0, 77.7], [12.9, 77.7]],
    description: 'Moderate risk - exercise caution',
    riskLevel: 6
  }
];
