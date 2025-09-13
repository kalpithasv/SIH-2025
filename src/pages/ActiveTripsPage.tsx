import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Trip, SosRequest, CommunityPost } from '../services/api';
import { Alert } from '../types';
import { adaptSosToAlert, adaptCommunityPostToAlert } from '../utils/dataAdapters';
import { formatDate, getTimeAgo } from '../utils';
import { MapPin, Calendar, User, AlertCircle, Clock, Navigation } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface ActiveTripsPageProps {
  trips: Trip[];
  sosRequests: SosRequest[];
  communityPosts: CommunityPost[];
}

export const ActiveTripsPage: React.FC<ActiveTripsPageProps> = ({ 
  trips, 
  sosRequests, 
  communityPosts 
}) => {
  const navigate = useNavigate();
  const [filter, setFilter] = useState<'all' | 'active' | 'completed' | 'cancelled'>('all');
  const [sortBy, setSortBy] = useState<'startDate' | 'safetyScore' | 'alerts'>('startDate');

  // Filter trips based on status
  const filteredTrips = trips.filter(trip => {
    if (filter === 'all') return true;
    if (filter === 'active') return trip.status === 'ACTIVE';
    if (filter === 'completed') return trip.status === 'COMPLETED';
    if (filter === 'cancelled') return trip.status === 'CANCELLED';
    return true;
  });

  // Get alerts related to a specific trip
  const getTripAlerts = (tripId: string): Alert[] => {
    const tripSosAlerts = sosRequests
      .filter(sos => sos.trip?.id === tripId)
      .map(adaptSosToAlert);
    
    const tripCommunityAlerts = communityPosts
      .filter(post => post.trip?.id === tripId)
      .map(adaptCommunityPostToAlert);
    
    return [...tripSosAlerts, ...tripCommunityAlerts];
  };

  // Sort trips
  const sortedTrips = [...filteredTrips].sort((a, b) => {
    switch (sortBy) {
      case 'startDate':
        return new Date(b.startDate).getTime() - new Date(a.startDate).getTime();
      case 'safetyScore':
        return (b.safetyScore || 0) - (a.safetyScore || 0);
      case 'alerts':
        return getTripAlerts(b.id).length - getTripAlerts(a.id).length;
      default:
        return 0;
    }
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return '🟢';
      case 'COMPLETED':
        return '✅';
      case 'CANCELLED':
        return '🔴';
      case 'PLANNED':
        return '🟡';
      default:
        return '⚪';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return 'success';
      case 'COMPLETED':
        return 'success';
      case 'CANCELLED':
        return 'danger';
      case 'PLANNED':
        return 'warning';
      default:
        return 'default';
    }
  };

  const handleTripClick = (trip: Trip) => {
    // Navigate to trip details page (we'll create this)
    navigate(`/dashboard/trip/${trip.id}`);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-2xl font-bold">Active Trips</CardTitle>
          <div className="flex space-x-2">
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value as any)}
              className="px-3 py-1 border border-gray-300 rounded-md text-sm"
            >
              <option value="all">All Trips</option>
              <option value="active">Active</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-3 py-1 border border-gray-300 rounded-md text-sm"
            >
              <option value="startDate">Start Date</option>
              <option value="safetyScore">Safety Score</option>
              <option value="alerts">Alerts Count</option>
            </select>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-4">
          {sortedTrips.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Navigation className="h-16 w-16 mx-auto mb-4 text-gray-300" />
              <p className="text-lg">No trips found</p>
              <p className="text-sm">Try adjusting your filters</p>
            </div>
          ) : (
            sortedTrips.map((trip) => {
              const tripAlerts = getTripAlerts(trip.id);
              const activeAlerts = tripAlerts.filter(alert => alert.status === 'active');
              
              return (
                <div
                  key={trip.id}
                  className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors duration-200 cursor-pointer"
                  onClick={() => handleTripClick(trip)}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">{getStatusIcon(trip.status)}</span>
                      <div>
                        <h3 className="font-semibold text-gray-900">{trip.title}</h3>
                        <p className="text-sm text-gray-600">{trip.description}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {activeAlerts.length > 0 && (
                        <Badge variant="danger" className="flex items-center space-x-1">
                          <AlertCircle className="h-3 w-3" />
                          <span>{activeAlerts.length} Alert{activeAlerts.length > 1 ? 's' : ''}</span>
                        </Badge>
                      )}
                      <Badge variant={getStatusColor(trip.status) as any}>
                        {trip.status}
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                    <div className="flex items-center space-x-2 text-sm">
                      <User className="h-4 w-4 text-gray-500" />
                      <span className="text-gray-600">
                        {trip.user.firstName} {trip.user.lastName}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm">
                      <MapPin className="h-4 w-4 text-gray-500" />
                      <span className="text-gray-600">{trip.startLocation}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm">
                      <Calendar className="h-4 w-4 text-gray-500" />
                      <span className="text-gray-600">{formatDate(trip.startDate)}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm">
                      <Clock className="h-4 w-4 text-gray-500" />
                      <span className="text-gray-600">
                        {trip.actualStartTime ? getTimeAgo(trip.actualStartTime) : 'Not started'}
                      </span>
                    </div>
                  </div>

                  {/* Safety Score and Route */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-4">
                      <div>
                        <p className="text-sm font-medium text-gray-700">Safety Score</p>
                        <p className="text-lg font-bold text-blue-600">
                          {trip.safetyScore || 'N/A'}
                        </p>
                      </div>
                      <div className="text-sm text-gray-600">
                        <p><strong>Route:</strong> {trip.startLocation} → {trip.endLocation}</p>
                        <p><strong>Duration:</strong> {formatDate(trip.startDate)} to {formatDate(trip.endDate)}</p>
                      </div>
                    </div>
                  </div>

                  {/* Alerts Summary */}
                  {tripAlerts.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-gray-200">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-700">
                          Recent Alerts ({tripAlerts.length})
                        </span>
                        <div className="flex space-x-2">
                          {tripAlerts.slice(0, 3).map((alert) => (
                            <Badge 
                              key={alert.id}
                              variant={alert.severity === 'critical' ? 'danger' : 
                                     alert.severity === 'high' ? 'warning' : 'default'}
                              className="text-xs"
                            >
                              {alert.type}
                            </Badge>
                          ))}
                          {tripAlerts.length > 3 && (
                            <Badge variant="default" className="text-xs">
                              +{tripAlerts.length - 3} more
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </CardContent>
    </Card>
  );
};