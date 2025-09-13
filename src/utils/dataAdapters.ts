// Data Adapters to map backend API responses to frontend models
import { Trip, SosRequest, CommunityPost, User } from '../services/api';
import { Tourist, Alert, DashboardStats } from '../types';

// Convert backend User to frontend Tourist model
export const adaptUserToTourist = (user: User): Tourist => {
  // Use current location data if available
  const currentLocation = {
    lat: user.currentLatitude || 0,
    lng: user.currentLongitude || 0,
    address: user.currentLatitude ? `Lat: ${user.currentLatitude.toFixed(4)}, Lng: ${user.currentLongitude?.toFixed(4)}` : 'Location not available'
  };

  return {
    id: user.id,
    name: `${user.firstName} ${user.lastName}`.trim() || 'Unknown User',
    nationality: 'India', // Default for Indian tourism app
    passportNumber: `IN${user.id.slice(-8).toUpperCase()}`, // Generate passport-like number
    phoneNumber: user.phone || 'Not available',
    email: user.email,
    arrivalDate: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // Random recent date
    departureDate: new Date(Date.now() + Math.random() * 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // Random future date
    currentLocation,
    safetyScore: Math.floor(75 + Math.random() * 20), // Random score between 75-95
    status: 'safe' as const, // Default status for users without trips
    lastSeen: user.lastLocationUpdate || new Date().toISOString(),
    travelHistory: [],
    emergencyContacts: [],
    isTrackingEnabled: !!user.currentLatitude // Tracking enabled if location is available
  };
};

// Convert backend Trip to frontend Tourist model (with location data)
export const adaptTripToTourist = (trip: Trip): Tourist => {
  const latestLocation = trip.locationUpdates?.[trip.locationUpdates.length - 1];
  
  return {
    id: trip.user.id,
    name: `${trip.user.firstName} ${trip.user.lastName}`,
    nationality: 'Unknown',
    passportNumber: 'N/A',
    phoneNumber: trip.user.phone,
    email: trip.user.email,
    arrivalDate: trip.startDate.split('T')[0],
    departureDate: trip.endDate.split('T')[0],
    currentLocation: latestLocation ? {
      lat: latestLocation.latitude,
      lng: latestLocation.longitude,
      address: trip.startLocation // Using start location as fallback
    } : {
      lat: 0,
      lng: 0,
      address: 'Unknown'
    },
    safetyScore: trip.safetyScore || 85,
    status: getTripStatusAsTouristStatus(trip.status),
    lastSeen: latestLocation?.timestamp || trip.createdAt,
    travelHistory: trip.locationUpdates?.map((update, index) => ({
      id: update.id,
      lat: update.latitude,
      lng: update.longitude,
      address: `${trip.startLocation} - Update ${index + 1}`,
      timestamp: update.timestamp,
      safetyScore: trip.safetyScore || 85,
      riskLevel: getRiskLevelFromSafetyScore(trip.safetyScore || 85)
    })) || [],
    emergencyContacts: [], // Will be populated separately if needed
    isTrackingEnabled: true
  };
};

// Convert backend SOS Request to frontend Alert model
export const adaptSosToAlert = (sos: SosRequest): Alert => {
  return {
    id: sos.id,
    touristId: sos.user.id,
    touristName: `${sos.user.firstName} ${sos.user.lastName}`,
    type: 'panic' as const, // SOS is panic type
    severity: getSosSeverity(sos.sosType),
    message: sos.description,
    timestamp: sos.createdAt,
    location: {
      lat: sos.latitude,
      lng: sos.longitude,
      address: sos.location
    },
    status: getSosStatusAsAlertStatus(sos.status),
    assignedTo: undefined // Not available in SOS model
  };
};

// Convert backend Community Post to frontend Alert model (for community reports)
export const adaptCommunityPostToAlert = (post: CommunityPost): Alert => {
  return {
    id: post.id,
    touristId: post.user.id,
    touristName: `${post.user.firstName} ${post.user.lastName}`,
    type: 'anomaly' as const, // Community posts as anomaly alerts
    severity: getPriorityAsSeverity(post.priority),
    message: `${post.title}: ${post.issueDescription}`,
    timestamp: post.createdAt,
    location: {
      lat: post.latitude,
      lng: post.longitude,
      address: post.location
    },
    status: getReportStatusAsAlertStatus(post.status),
    assignedTo: undefined
  };
};

// Helper functions
const getTripStatusAsTouristStatus = (tripStatus: string): 'safe' | 'warning' | 'danger' | 'missing' => {
  switch (tripStatus) {
    case 'ACTIVE':
      return 'safe';
    case 'COMPLETED':
      return 'safe';
    case 'CANCELLED':
      return 'warning';
    default:
      return 'safe';
  }
};

const getRiskLevelFromSafetyScore = (score: number): 'low' | 'medium' | 'high' => {
  if (score >= 80) return 'low';
  if (score >= 60) return 'medium';
  return 'high';
};

const getSosSeverity = (sosType: string): 'low' | 'medium' | 'high' | 'critical' => {
  switch (sosType) {
    case 'MEDICAL':
    case 'SECURITY':
      return 'critical';
    case 'ACCIDENT':
    case 'NATURAL_DISASTER':
      return 'high';
    case 'GENERAL':
    default:
      return 'medium';
  }
};

const getSosStatusAsAlertStatus = (sosStatus: string): 'active' | 'investigating' | 'resolved' => {
  switch (sosStatus) {
    case 'NEW':
    case 'ACKNOWLEDGED':
      return 'active';
    case 'IN_PROGRESS':
      return 'investigating';
    case 'RESOLVED':
    case 'FALSE_ALARM':
      return 'resolved';
    default:
      return 'active';
  }
};

const getPriorityAsSeverity = (priority: string): 'low' | 'medium' | 'high' | 'critical' => {
  switch (priority) {
    case 'URGENT':
      return 'critical';
    case 'HIGH':
      return 'high';
    case 'MEDIUM':
      return 'medium';
    case 'LOW':
    default:
      return 'low';
  }
};

const getReportStatusAsAlertStatus = (reportStatus: string): 'active' | 'investigating' | 'resolved' => {
  switch (reportStatus) {
    case 'OPEN':
      return 'active';
    case 'UNDER_REVIEW':
      return 'investigating';
    case 'RESOLVED':
    case 'CLOSED':
      return 'resolved';
    default:
      return 'active';
  }
};

// Create dashboard stats from available data
export const createDashboardStats = (
  users: User[] = [],
  trips: Trip[] = [],
  sosRequests: SosRequest[] = [],
  _communityPosts: CommunityPost[] = []
): DashboardStats => {
  const totalTourists = users.length;
  const activeTrips = trips.filter(trip => trip.status === 'ACTIVE').length;
  const completedTrips = trips.filter(trip => trip.status === 'COMPLETED').length;
  
  // Calculate safety scores
  const safetyScores = trips.map(trip => trip.safetyScore || 85);
  const averageSafetyScore = safetyScores.length > 0 
    ? Math.round(safetyScores.reduce((sum, score) => sum + score, 0) / safetyScores.length)
    : 85;

  // Count tourists by status (based on trip status)
  const safeTourists = completedTrips + activeTrips;
  const warningTourists = trips.filter(trip => trip.status === 'CANCELLED').length;
  const dangerTourists = sosRequests.filter(sos => sos.status === 'NEW' || sos.status === 'ACKNOWLEDGED').length;
  const missingTourists = 0; // Not available in current backend model

  // Count alerts
  const activeAlerts = sosRequests.filter(sos => 
    sos.status === 'NEW' || sos.status === 'ACKNOWLEDGED' || sos.status === 'IN_PROGRESS'
  ).length;
  const resolvedAlerts = sosRequests.filter(sos => 
    sos.status === 'RESOLVED' || sos.status === 'FALSE_ALARM'
  ).length;

  return {
    totalTourists,
    safeTourists,
    warningTourists,
    dangerTourists,
    missingTourists,
    averageSafetyScore,
    activeAlerts,
    resolvedAlerts
  };
};

// Utility function to get tourist status from trip data
export const getTouristStatusFromTrip = (trip: Trip): 'safe' | 'warning' | 'danger' | 'missing' => {
  // Check if there are active SOS requests
  const hasActiveSos = trip.sosRequests?.some(sos => 
    sos.status === 'NEW' || sos.status === 'ACKNOWLEDGED'
  );

  if (hasActiveSos) {
    return 'danger';
  }

  // Check if trip is active and recent
  const isRecentActivity = trip.locationUpdates?.some(update => {
    const updateTime = new Date(update.timestamp);
    const now = new Date();
    const hoursDiff = (now.getTime() - updateTime.getTime()) / (1000 * 60 * 60);
    return hoursDiff < 24; // Active within 24 hours
  });

  if (trip.status === 'ACTIVE' && isRecentActivity) {
    return 'safe';
  }

  if (trip.status === 'CANCELLED') {
    return 'warning';
  }

  return 'safe';
};
