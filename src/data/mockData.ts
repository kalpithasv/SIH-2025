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
    id: '5',
    name: 'Yuki Tanaka',
    nationality: 'Japan',
    passportNumber: 'JP567891234',
    phoneNumber: '+81-80-1234-5678',
    email: 'yuki.tanaka@email.com',
    arrivalDate: '2024-01-16',
    departureDate: '2024-01-26',
    currentLocation: {
      lat: 15.4989,
      lng: 73.8278,
      address: 'Calangute Beach, Goa'
    },
    safetyScore: 88,
    status: 'safe',
    lastSeen: '2024-01-20T12:15:00Z',
    travelHistory: [
      {
        id: '6',
        lat: 15.4989,
        lng: 73.8278,
        address: 'Calangute Beach, Goa',
        timestamp: '2024-01-20T12:15:00Z',
        safetyScore: 88,
        riskLevel: 'low'
      }
    ],
    emergencyContacts: [
      {
        id: '5',
        name: 'Kenji Tanaka',
        relationship: 'Brother',
        phoneNumber: '+81-80-1234-5679',
        email: 'kenji.tanaka@email.com'
      }
    ],
    isTrackingEnabled: true
  },
  {
    id: '6',
    name: 'Emma Wilson',
    nationality: 'UK',
    passportNumber: 'UK234567891',
    phoneNumber: '+44-7700-123456',
    email: 'emma.wilson@email.com',
    arrivalDate: '2024-01-17',
    departureDate: '2024-01-27',
    currentLocation: {
      lat: 26.9018,
      lng: 75.8236,
      address: 'City Palace, Jaipur'
    },
    safetyScore: 76,
    status: 'warning',
    lastSeen: '2024-01-20T11:45:00Z',
    travelHistory: [
      {
        id: '7',
        lat: 26.9018,
        lng: 75.8236,
        address: 'City Palace, Jaipur',
        timestamp: '2024-01-20T11:45:00Z',
        safetyScore: 76,
        riskLevel: 'medium'
      }
    ],
    emergencyContacts: [
      {
        id: '6',
        name: 'James Wilson',
        relationship: 'Father',
        phoneNumber: '+44-7700-123457',
        email: 'james.wilson@email.com'
      }
    ],
    isTrackingEnabled: true
  },
  {
    id: '7',
    name: 'Lucas Schmidt',
    nationality: 'Germany',
    passportNumber: 'DE345678912',
    phoneNumber: '+49-151-12345678',
    email: 'lucas.schmidt@email.com',
    arrivalDate: '2024-01-14',
    departureDate: '2024-01-24',
    currentLocation: {
      lat: 32.2396,
      lng: 77.1887,
      address: 'Manali, Himachal Pradesh'
    },
    safetyScore: 92,
    status: 'safe',
    lastSeen: '2024-01-20T13:00:00Z',
    travelHistory: [
      {
        id: '8',
        lat: 32.2396,
        lng: 77.1887,
        address: 'Manali, Himachal Pradesh',
        timestamp: '2024-01-20T13:00:00Z',
        safetyScore: 92,
        riskLevel: 'low'
      }
    ],
    emergencyContacts: [
      {
        id: '7',
        name: 'Anna Schmidt',
        relationship: 'Sister',
        phoneNumber: '+49-151-12345679',
        email: 'anna.schmidt@email.com'
      }
    ],
    isTrackingEnabled: true
  },
  {
    id: '8',
    name: 'Sofia Rodriguez',
    nationality: 'Argentina',
    passportNumber: 'AR456789123',
    phoneNumber: '+54-911-1234-5678',
    email: 'sofia.rodriguez@email.com',
    arrivalDate: '2024-01-13',
    departureDate: '2024-01-23',
    currentLocation: {
      lat: 23.2156,
      lng: 69.6669,
      address: 'Rann of Kutch, Gujarat'
    },
    safetyScore: 65,
    status: 'warning',
    lastSeen: '2024-01-20T10:30:00Z',
    travelHistory: [
      {
        id: '9',
        lat: 23.2156,
        lng: 69.6669,
        address: 'Rann of Kutch, Gujarat',
        timestamp: '2024-01-20T10:30:00Z',
        safetyScore: 65,
        riskLevel: 'medium'
      }
    ],
    emergencyContacts: [
      {
        id: '8',
        name: 'Diego Rodriguez',
        relationship: 'Spouse',
        phoneNumber: '+54-911-1234-5679',
        email: 'diego.rodriguez@email.com'
      }
    ],
    isTrackingEnabled: true
  },
  {
    id: '9',
    name: 'Oliver Anderson',
    nationality: 'Australia',
    passportNumber: 'AU567891234',
    phoneNumber: '+61-4-1234-5678',
    email: 'oliver.anderson@email.com',
    arrivalDate: '2024-01-19',
    departureDate: '2024-01-29',
    currentLocation: {
      lat: 27.1751,
      lng: 78.0421,
      address: 'Taj Mahal, Agra'
    },
    safetyScore: 82,
    status: 'safe',
    lastSeen: '2024-01-20T14:15:00Z',
    travelHistory: [
      {
        id: '10',
        lat: 27.1751,
        lng: 78.0421,
        address: 'Taj Mahal, Agra',
        timestamp: '2024-01-20T14:15:00Z',
        safetyScore: 82,
        riskLevel: 'low'
      }
    ],
    emergencyContacts: [
      {
        id: '9',
        name: 'Emma Anderson',
        relationship: 'Mother',
        phoneNumber: '+61-4-1234-5679',
        email: 'emma.anderson@email.com'
      }
    ],
    isTrackingEnabled: true
  },
  {
    id: '10',
    name: 'Mohammed Al-Rashid',
    nationality: 'Saudi Arabia',
    passportNumber: 'SA678912345',
    phoneNumber: '+966-50-123-4567',
    email: 'mohammed.alrashid@email.com',
    arrivalDate: '2024-01-15',
    departureDate: '2024-01-25',
    currentLocation: {
      lat: 33.5138,
      lng: 36.2765,
      address: 'Damascus, Syria'
    },
    safetyScore: 35,
    status: 'danger',
    lastSeen: '2024-01-20T09:30:00Z',
    travelHistory: [
      {
        id: '11',
        lat: 33.5138,
        lng: 36.2765,
        address: 'Damascus, Syria',
        timestamp: '2024-01-20T09:30:00Z',
        safetyScore: 35,
        riskLevel: 'high'
      }
    ],
    emergencyContacts: [
      {
        id: '10',
        name: 'Abdullah Al-Rashid',
        relationship: 'Father',
        phoneNumber: '+966-50-123-4568',
        email: 'abdullah.alrashid@email.com'
      }
    ],
    isTrackingEnabled: true
  },
  {
    id: '11',
    name: 'Isabella Martinez',
    nationality: 'Colombia',
    passportNumber: 'CO789123456',
    phoneNumber: '+57-321-123-4567',
    email: 'isabella.martinez@email.com',
    arrivalDate: '2024-01-16',
    departureDate: '2024-01-26',
    currentLocation: {
      lat: -33.4489,
      lng: -70.6693,
      address: 'Santiago, Chile'
    },
    safetyScore: 55,
    status: 'warning',
    lastSeen: '2024-01-20T11:45:00Z',
    travelHistory: [
      {
        id: '12',
        lat: -33.4489,
        lng: -70.6693,
        address: 'Santiago, Chile',
        timestamp: '2024-01-20T11:45:00Z',
        safetyScore: 55,
        riskLevel: 'medium'
      }
    ],
    emergencyContacts: [
      {
        id: '11',
        name: 'Carlos Martinez',
        relationship: 'Brother',
        phoneNumber: '+57-321-123-4568',
        email: 'carlos.martinez@email.com'
      }
    ],
    isTrackingEnabled: true
  },
  {
    id: '12',
    name: 'Viktor Petrov',
    nationality: 'Russia',
    passportNumber: 'RU891234567',
    phoneNumber: '+7-925-123-4567',
    email: 'viktor.petrov@email.com',
    arrivalDate: '2024-01-17',
    departureDate: '2024-01-27',
    currentLocation: {
      lat: 50.4501,
      lng: 30.5234,
      address: 'Kiev, Ukraine'
    },
    safetyScore: 25,
    status: 'danger',
    lastSeen: '2024-01-20T08:15:00Z',
    travelHistory: [
      {
        id: '13',
        lat: 50.4501,
        lng: 30.5234,
        address: 'Kiev, Ukraine',
        timestamp: '2024-01-20T08:15:00Z',
        safetyScore: 25,
        riskLevel: 'high'
      }
    ],
    emergencyContacts: [
      {
        id: '12',
        name: 'Natasha Petrova',
        relationship: 'Wife',
        phoneNumber: '+7-925-123-4568',
        email: 'natasha.petrova@email.com'
      }
    ],
    isTrackingEnabled: true
  },
  {
    id: '13',
    name: 'Aisha Omar',
    nationality: 'Nigeria',
    passportNumber: 'NG912345678',
    phoneNumber: '+234-801-234-5678',
    email: 'aisha.omar@email.com',
    arrivalDate: '2024-01-18',
    departureDate: '2024-01-28',
    currentLocation: {
      lat: 12.1348,
      lng: 15.0557,
      address: 'N\'Djamena, Chad'
    },
    safetyScore: 40,
    status: 'danger',
    lastSeen: '2024-01-20T13:30:00Z',
    travelHistory: [
      {
        id: '14',
        lat: 12.1348,
        lng: 15.0557,
        address: 'N\'Djamena, Chad',
        timestamp: '2024-01-20T13:30:00Z',
        safetyScore: 40,
        riskLevel: 'high'
      }
    ],
    emergencyContacts: [
      {
        id: '13',
        name: 'Ibrahim Omar',
        relationship: 'Father',
        phoneNumber: '+234-801-234-5679',
        email: 'ibrahim.omar@email.com'
      }
    ],
    isTrackingEnabled: true
  },
  {
    id: '14',
    name: 'David Cohen',
    nationality: 'Israel',
    passportNumber: 'IL123456789',
    phoneNumber: '+972-50-123-4567',
    email: 'david.cohen@email.com',
    arrivalDate: '2024-01-19',
    departureDate: '2024-01-29',
    currentLocation: {
      lat: 33.8938,
      lng: 35.5018,
      address: 'Beirut, Lebanon'
    },
    safetyScore: 45,
    status: 'danger',
    lastSeen: '2024-01-20T10:45:00Z',
    travelHistory: [
      {
        id: '15',
        lat: 33.8938,
        lng: 35.5018,
        address: 'Beirut, Lebanon',
        timestamp: '2024-01-20T10:45:00Z',
        safetyScore: 45,
        riskLevel: 'high'
      }
    ],
    emergencyContacts: [
      {
        id: '14',
        name: 'Sarah Cohen',
        relationship: 'Sister',
        phoneNumber: '+972-50-123-4568',
        email: 'sarah.cohen@email.com'
      }
    ],
    isTrackingEnabled: true
  },
  {
    id: '15',
    name: 'Min-Jun Kim',
    nationality: 'South Korea',
    passportNumber: 'KR234567891',
    phoneNumber: '+82-10-1234-5678',
    email: 'minjun.kim@email.com',
    arrivalDate: '2024-01-15',
    departureDate: '2024-01-25',
    currentLocation: {
      lat: 39.0392,
      lng: 125.7625,
      address: 'Pyongyang, North Korea'
    },
    safetyScore: 30,
    status: 'danger',
    lastSeen: '2024-01-20T12:15:00Z',
    travelHistory: [
      {
        id: '16',
        lat: 39.0392,
        lng: 125.7625,
        address: 'Pyongyang, North Korea',
        timestamp: '2024-01-20T12:15:00Z',
        safetyScore: 30,
        riskLevel: 'high'
      }
    ],
    emergencyContacts: [
      {
        id: '15',
        name: 'Ji-Hye Kim',
        relationship: 'Spouse',
        phoneNumber: '+82-10-1234-5679',
        email: 'jihye.kim@email.com'
      }
    ],
    isTrackingEnabled: true
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
  totalTourists: 15,
  safeTourists: 4,
  warningTourists: 3,
  dangerTourists: 7,
  missingTourists: 1,
  averageSafetyScore: 52.6,
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

// Mock Analytics Data - Specifically for Analytics Section Only
export const mockAnalyticsData = {
  // Safety Score by Area - Bar Chart Data
  areaStats: [
    {
      area: 'Delhi',
      averageScore: 78,
      touristCount: 45,
      safeCount: 32,
      warningCount: 8,
      dangerCount: 4,
      missingCount: 1
    },
    {
      area: 'Mumbai',
      averageScore: 65,
      touristCount: 38,
      safeCount: 22,
      warningCount: 10,
      dangerCount: 5,
      missingCount: 1
    },
    {
      area: 'Bangalore',
      averageScore: 82,
      touristCount: 28,
      safeCount: 24,
      warningCount: 3,
      dangerCount: 1,
      missingCount: 0
    },
    {
      area: 'Chennai',
      averageScore: 71,
      touristCount: 22,
      safeCount: 15,
      warningCount: 4,
      dangerCount: 2,
      missingCount: 1
    },
    {
      area: 'Kolkata',
      averageScore: 69,
      touristCount: 18,
      safeCount: 12,
      warningCount: 4,
      dangerCount: 2,
      missingCount: 0
    },
    {
      area: 'Hyderabad',
      averageScore: 75,
      touristCount: 15,
      safeCount: 11,
      warningCount: 3,
      dangerCount: 1,
      missingCount: 0
    },
    {
      area: 'Pune',
      averageScore: 80,
      touristCount: 12,
      safeCount: 10,
      warningCount: 2,
      dangerCount: 0,
      missingCount: 0
    },
    {
      area: 'Jaipur',
      averageScore: 73,
      touristCount: 25,
      safeCount: 18,
      warningCount: 5,
      dangerCount: 2,
      missingCount: 0
    },
    {
      area: 'Goa',
      averageScore: 85,
      touristCount: 35,
      safeCount: 30,
      warningCount: 4,
      dangerCount: 1,
      missingCount: 0
    },
    {
      area: 'Agra',
      averageScore: 74,
      touristCount: 20,
      safeCount: 15,
      warningCount: 3,
      dangerCount: 2,
      missingCount: 0
    },
    {
      area: 'Shimla',
      averageScore: 88,
      touristCount: 14,
      safeCount: 13,
      warningCount: 1,
      dangerCount: 0,
      missingCount: 0
    },
    {
      area: 'Manali',
      averageScore: 90,
      touristCount: 16,
      safeCount: 15,
      warningCount: 1,
      dangerCount: 0,
      missingCount: 0
    }
  ],

  // 24-Hour Safety Score Trends - Line Chart Data
  hourlyTrends: [
    { time: '00:00', score: 72, activeUsers: 15, alerts: 2 },
    { time: '02:00', score: 71, activeUsers: 12, alerts: 1 },
    { time: '04:00', score: 70, activeUsers: 8, alerts: 1 },
    { time: '06:00', score: 75, activeUsers: 25, alerts: 3 },
    { time: '08:00', score: 78, activeUsers: 45, alerts: 4 },
    { time: '10:00', score: 82, activeUsers: 68, alerts: 5 },
    { time: '12:00', score: 85, activeUsers: 82, alerts: 3 },
    { time: '14:00', score: 83, activeUsers: 75, alerts: 4 },
    { time: '16:00', score: 81, activeUsers: 70, alerts: 6 },
    { time: '18:00', score: 79, activeUsers: 62, alerts: 7 },
    { time: '20:00', score: 77, activeUsers: 48, alerts: 5 },
    { time: '22:00', score: 74, activeUsers: 32, alerts: 4 }
  ],

  // Weekly Safety Score Trends
  weeklyTrends: [
    { day: 'Monday', score: 76, incidents: 12, tourists: 234 },
    { day: 'Tuesday', score: 78, incidents: 10, tourists: 267 },
    { day: 'Wednesday', score: 82, incidents: 8, tourists: 298 },
    { day: 'Thursday', score: 80, incidents: 9, tourists: 285 },
    { day: 'Friday', score: 75, incidents: 15, tourists: 325 },
    { day: 'Saturday', score: 73, incidents: 18, tourists: 410 },
    { day: 'Sunday', score: 71, incidents: 22, tourists: 456 }
  ],

  // Risk Distribution Data - Pie Chart
  riskDistribution: [
    { name: 'Safe', value: 182, percentage: 61.3, color: '#22c55e' },
    { name: 'Warning', value: 68, percentage: 22.9, color: '#f59e0b' },
    { name: 'Danger', value: 38, percentage: 12.8, color: '#ef4444' },
    { name: 'Missing', value: 9, percentage: 3.0, color: '#6b7280' }
  ],

  // Top Risk Locations
  topRiskLocations: [
    { location: 'Mumbai Dharavi', riskScore: 85, incidents: 15, tourists: 12 },
    { location: 'Delhi Old City', riskScore: 78, incidents: 12, tourists: 18 },
    { location: 'Kolkata Slum Areas', riskScore: 72, incidents: 9, tourists: 8 },
    { location: 'Chennai Marina Beach', riskScore: 68, incidents: 7, tourists: 25 },
    { location: 'Bangalore Traffic Zones', riskScore: 65, incidents: 6, tourists: 15 }
  ],

  // Safety Score Distribution Histogram
  scoreDistribution: [
    { scoreRange: '0-20', count: 8, percentage: 2.7 },
    { scoreRange: '21-40', count: 15, percentage: 5.1 },
    { scoreRange: '41-60', count: 35, percentage: 11.8 },
    { scoreRange: '61-80', count: 112, percentage: 37.7 },
    { scoreRange: '81-100', count: 127, percentage: 42.7 }
  ],

  // Response Time Analytics
  responseTimeData: [
    { alertType: 'Panic Button', avgResponseTime: 2.3, count: 45 },
    { alertType: 'Geofence Violation', avgResponseTime: 5.7, count: 28 },
    { alertType: 'Missing Person', avgResponseTime: 8.2, count: 12 },
    { alertType: 'Medical Emergency', avgResponseTime: 1.8, count: 18 },
    { alertType: 'Suspicious Activity', avgResponseTime: 4.1, count: 22 }
  ],

  // Tourist Heatmap Data (for Analytics Heatmap)
  heatmapTourists: [
    // Delhi cluster
    { id: 'heat-1', lat: 28.6139, lng: 77.2090, score: 85, status: 'safe', area: 'Delhi' },
    { id: 'heat-2', lat: 28.6289, lng: 77.2065, score: 78, status: 'safe', area: 'Delhi' },
    { id: 'heat-3', lat: 28.6169, lng: 77.2295, score: 65, status: 'warning', area: 'Delhi' },
    { id: 'heat-4', lat: 28.5985, lng: 77.2295, score: 72, status: 'warning', area: 'Delhi' },
    
    // Mumbai cluster
    { id: 'heat-5', lat: 19.0760, lng: 72.8777, score: 68, status: 'warning', area: 'Mumbai' },
    { id: 'heat-6', lat: 19.0896, lng: 72.8656, score: 45, status: 'danger', area: 'Mumbai' },
    { id: 'heat-7', lat: 19.0625, lng: 72.8972, score: 75, status: 'safe', area: 'Mumbai' },
    
    // Bangalore cluster
    { id: 'heat-8', lat: 12.9716, lng: 77.5946, score: 82, status: 'safe', area: 'Bangalore' },
    { id: 'heat-9', lat: 12.9853, lng: 77.6103, score: 88, status: 'safe', area: 'Bangalore' },
    { id: 'heat-10', lat: 12.9279, lng: 77.6271, score: 79, status: 'safe', area: 'Bangalore' },
    
    // Goa cluster
    { id: 'heat-11', lat: 15.4989, lng: 73.8278, score: 92, status: 'safe', area: 'Goa' },
    { id: 'heat-12', lat: 15.5057, lng: 73.9964, score: 89, status: 'safe', area: 'Goa' },
    { id: 'heat-13', lat: 15.2832, lng: 74.1240, score: 85, status: 'safe', area: 'Goa' },
    
    // Jaipur cluster
    { id: 'heat-14', lat: 26.9018, lng: 75.8236, score: 76, status: 'warning', area: 'Jaipur' },
    { id: 'heat-15', lat: 26.9124, lng: 75.7873, score: 58, status: 'warning', area: 'Jaipur' },
    
    // Agra cluster
    { id: 'heat-16', lat: 27.1751, lng: 78.0421, score: 82, status: 'safe', area: 'Agra' },
    { id: 'heat-17', lat: 27.1767, lng: 78.0081, score: 74, status: 'safe', area: 'Agra' },
    
    // High-risk scattered locations
    { id: 'heat-18', lat: 23.2156, lng: 69.6669, score: 35, status: 'danger', area: 'Gujarat' },
    { id: 'heat-19', lat: 32.2396, lng: 77.1887, score: 92, status: 'safe', area: 'Himachal' },
    { id: 'heat-20', lat: 25.3176, lng: 82.9739, score: 42, status: 'danger', area: 'UP' }
  ]
};
