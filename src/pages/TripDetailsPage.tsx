import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { AcknowledgeModal } from '../components/ui/AcknowledgeModal';
import { Trip, SosRequest, CommunityPost } from '../services/api';
import { Alert } from '../types';
import { adaptSosToAlert, adaptCommunityPostToAlert } from '../utils/dataAdapters';
import { formatDate, getTimeAgo } from '../utils';
import { 
  MapPin, 
  Calendar, 
  User, 
  AlertCircle, 
  Clock, 
  ArrowLeft,
  Route,
  Shield,
  Phone,
  Mail,
  Navigation,
  MessageSquare
} from 'lucide-react';
import apiService from '../services/api';

interface TripDetailsPageProps {
  trips: Trip[];
  sosRequests: SosRequest[];
  communityPosts: CommunityPost[];
}

export const TripDetailsPage: React.FC<TripDetailsPageProps> = ({ 
  trips, 
  sosRequests, 
  communityPosts 
}) => {
  const { tripId } = useParams<{ tripId: string }>();
  const navigate = useNavigate();
  const [trip, setTrip] = useState<Trip | null>(null);
  const [tripAlerts, setTripAlerts] = useState<Alert[]>([]);
  
  // Acknowledge modal state
  const [acknowledgeModal, setAcknowledgeModal] = useState<{
    isOpen: boolean;
    alert: Alert | null;
  }>({ isOpen: false, alert: null });
  const [isAcknowledging, setIsAcknowledging] = useState(false);

  useEffect(() => {
    if (!tripId) return;
    
    // Find the trip
    const foundTrip = trips.find(t => t.id === tripId);
    setTrip(foundTrip || null);
    
    if (foundTrip) {
      // Get alerts related to this trip
      const sosAlerts = sosRequests
        .filter(sos => sos.trip?.id === tripId)
        .map(adaptSosToAlert);
      
      const communityAlerts = communityPosts
        .filter(post => post.trip?.id === tripId)
        .map(adaptCommunityPostToAlert);
      
      setTripAlerts([...sosAlerts, ...communityAlerts].sort(
        (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      ));
    }
  }, [tripId, trips, sosRequests, communityPosts]);

  const handleAcknowledgeClick = (alert: Alert) => {
    setAcknowledgeModal({ isOpen: true, alert });
  };

  const handleAcknowledgeConfirm = async (comment: string, action: 'acknowledge' | 'resolve' | 'false_alarm' = 'acknowledge') => {
    if (!acknowledgeModal.alert) return;

    setIsAcknowledging(true);
    try {
      console.log(`🚨 ${action} trip alert:`, acknowledgeModal.alert.id, acknowledgeModal.alert.type);
      
      if (acknowledgeModal.alert.type === 'panic') {
        // This is an SOS alert
        switch (action) {
          case 'acknowledge':
            await apiService.acknowledgeSosRequest(acknowledgeModal.alert.id, comment);
            break;
          case 'resolve':
            await apiService.resolveSosRequest(acknowledgeModal.alert.id, comment);
            break;
          case 'false_alarm':
            await apiService.markSosAsFalseAlarm(acknowledgeModal.alert.id, comment);
            break;
        }
      } else if (acknowledgeModal.alert.type === 'anomaly') {
        // This is a community report
        const reportStatus = action === 'resolve' ? 'RESOLVED' : 'UNDER_REVIEW';
        await apiService.updateCommunityReportStatus(acknowledgeModal.alert.id, reportStatus, comment);
      }
      
      console.log(`✅ Trip alert ${action}d successfully`);
      
      // Refresh trip alerts
      if (trip) {
        const sosAlerts = sosRequests
          .filter(sos => sos.trip?.id === tripId)
          .map(adaptSosToAlert);
        
        const communityAlerts = communityPosts
          .filter(post => post.trip?.id === tripId)
          .map(adaptCommunityPostToAlert);
        
        setTripAlerts([...sosAlerts, ...communityAlerts].sort(
          (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
        ));
      }
      
      setAcknowledgeModal({ isOpen: false, alert: null });
      
    } catch (error) {
      console.error(`❌ Failed to ${action} trip alert:`, error);
      alert(`Failed to ${action} alert. Please try again.`);
    } finally {
      setIsAcknowledging(false);
    }
  };

  const handleAcknowledgeCancel = () => {
    setAcknowledgeModal({ isOpen: false, alert: null });
  };

  if (!trip) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center text-gray-500">
          <Navigation className="h-16 w-16 mx-auto mb-4 text-gray-300" />
          <p className="text-lg">Trip not found</p>
          <button 
            onClick={() => navigate('/dashboard/trips')}
            className="mt-4 px-4 py-2 text-blue-600 hover:text-blue-800"
          >
            Back to Trips
          </button>
        </div>
      </div>
    );
  }

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

  const getAlertSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'danger';
      case 'high':
        return 'warning';
      case 'medium':
        return 'warning';
      case 'low':
        return 'default';
      default:
        return 'default';
    }
  };

  const activeAlerts = tripAlerts.filter(alert => alert.status === 'active');
  const resolvedAlerts = tripAlerts.filter(alert => alert.status === 'resolved');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <button 
          onClick={() => navigate('/dashboard/trips')}
          className="flex items-center space-x-2 text-gray-600 hover:text-gray-800"
        >
          <ArrowLeft className="h-5 w-5" />
          <span>Back to Trips</span>
        </button>
      </div>

      {/* Trip Overview */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <span className="text-3xl">{getStatusIcon(trip.status)}</span>
              <div>
                <CardTitle className="text-2xl">{trip.title}</CardTitle>
                <p className="text-gray-600 mt-1">{trip.description}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              {activeAlerts.length > 0 && (
                <Badge variant="danger" className="flex items-center space-x-1">
                  <AlertCircle className="h-4 w-4" />
                  <span>{activeAlerts.length} Active Alert{activeAlerts.length > 1 ? 's' : ''}</span>
                </Badge>
              )}
              <Badge variant={getStatusColor(trip.status) as any} className="text-lg px-3 py-1">
                {trip.status}
              </Badge>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Traveler Info */}
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-900 flex items-center">
                <User className="h-5 w-5 mr-2" />
                Traveler Information
              </h3>
              <div className="space-y-2">
                <p><strong>Name:</strong> {trip.user.firstName} {trip.user.lastName}</p>
                <div className="flex items-center space-x-2">
                  <Phone className="h-4 w-4 text-gray-500" />
                  <span>{trip.user.phone}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Mail className="h-4 w-4 text-gray-500" />
                  <span>{trip.user.email}</span>
                </div>
              </div>
            </div>

            {/* Trip Details */}
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-900 flex items-center">
                <Route className="h-5 w-5 mr-2" />
                Trip Details
              </h3>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <MapPin className="h-4 w-4 text-green-500" />
                  <span><strong>From:</strong> {trip.startLocation}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <MapPin className="h-4 w-4 text-red-500" />
                  <span><strong>To:</strong> {trip.endLocation}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4 text-gray-500" />
                  <span><strong>Start:</strong> {formatDate(trip.startDate)}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4 text-gray-500" />
                  <span><strong>End:</strong> {formatDate(trip.endDate)}</span>
                </div>
              </div>
            </div>

            {/* Safety & Status */}
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-900 flex items-center">
                <Shield className="h-5 w-5 mr-2" />
                Safety & Status
              </h3>
              <div className="space-y-2">
                <p><strong>Safety Score:</strong> 
                  <span className="ml-2 text-lg font-bold text-blue-600">
                    {trip.safetyScore || 'N/A'}
                  </span>
                </p>
                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4 text-gray-500" />
                  <span><strong>Started:</strong> {
                    trip.actualStartTime ? getTimeAgo(trip.actualStartTime) : 'Not started'
                  }</span>
                </div>
                <p><strong>Location Updates:</strong> {trip._count?.locationUpdates || 0}</p>
                <p><strong>Created:</strong> {getTimeAgo(trip.createdAt)}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Alerts Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <AlertCircle className="h-6 w-6 mr-2" />
            Trip Alerts ({tripAlerts.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {tripAlerts.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Shield className="h-16 w-16 mx-auto mb-4 text-green-300" />
              <p className="text-lg">No alerts for this trip</p>
              <p className="text-sm">This trip has been safe so far!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Active Alerts */}
              {activeAlerts.length > 0 && (
                <div>
                  <h4 className="font-semibold text-red-600 mb-3 flex items-center">
                    <AlertCircle className="h-5 w-5 mr-2" />
                    Active Alerts ({activeAlerts.length})
                  </h4>
                  <div className="space-y-3">
                    {activeAlerts.map((alert) => (
                      <div 
                        key={alert.id}
                        className="border-l-4 border-red-500 bg-red-50 p-4 rounded-r-lg"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-2">
                            <Badge variant={getAlertSeverityColor(alert.severity) as any}>
                              {alert.severity.toUpperCase()}
                            </Badge>
                            <Badge variant="default">{alert.type.toUpperCase()}</Badge>
                          </div>
                          <span className="text-sm text-gray-600">
                            {getTimeAgo(alert.timestamp)}
                          </span>
                        </div>
                        <p className="text-gray-800 mb-2">{alert.message}</p>
                        <div className="flex items-center text-sm text-gray-600">
                          <MapPin className="h-4 w-4 mr-1" />
                          {alert.location.address}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Resolved Alerts */}
              {resolvedAlerts.length > 0 && (
                <div>
                  <h4 className="font-semibold text-green-600 mb-3 flex items-center">
                    ✅ Resolved Alerts ({resolvedAlerts.length})
                  </h4>
                  <div className="space-y-3">
                    {resolvedAlerts.map((alert) => (
                      <div 
                        key={alert.id}
                        className="border-l-4 border-green-500 bg-green-50 p-4 rounded-r-lg"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-2">
                            <Badge variant="success">RESOLVED</Badge>
                            <Badge variant="default">{alert.type.toUpperCase()}</Badge>
                          </div>
                          <span className="text-sm text-gray-600">
                            {getTimeAgo(alert.timestamp)}
                          </span>
                        </div>
                        <p className="text-gray-800 mb-2">{alert.message}</p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center text-sm text-gray-600">
                            <MapPin className="h-4 w-4 mr-1" />
                            {alert.location.address}
                          </div>
                          {alert.status === 'active' && (
                            <Button 
                              size="sm" 
                              variant="warning"
                              onClick={() => handleAcknowledgeClick(alert)}
                            >
                              <MessageSquare className="h-4 w-4 mr-1" />
                              Acknowledge
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Acknowledge Modal */}
      <AcknowledgeModal
        isOpen={acknowledgeModal.isOpen}
        alertType={acknowledgeModal.alert?.type === 'panic' ? 'SOS' : 'Community Report'}
        alertTitle={acknowledgeModal.alert ? `${acknowledgeModal.alert.touristName} - ${acknowledgeModal.alert.type} Alert` : ''}
        onConfirm={handleAcknowledgeConfirm}
        onCancel={handleAcknowledgeCancel}
        isLoading={isAcknowledging}
      />
    </div>
  );
};
