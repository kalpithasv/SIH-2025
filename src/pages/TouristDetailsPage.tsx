import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Tourist } from '../types';
import { mockTourists } from '../data/mockData';
import { 
  ArrowLeft, 
  MapPin, 
  Phone, 
  Mail, 
  Calendar, 
  Shield, 
  Eye, 
  EyeOff,
  User,
  AlertTriangle
} from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';
import { formatDate, getTimeAgo } from '../utils';

export const TouristDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const tourist = mockTourists.find(t => t.id === id);

  if (!tourist) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Tourist Not Found</h2>
          <p className="text-gray-600 mb-4">The requested tourist could not be found.</p>
          <Button onClick={() => navigate('/')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'safe':
        return '🟢';
      case 'warning':
        return '🟡';
      case 'danger':
        return '🔴';
      case 'missing':
        return '⚫';
      default:
        return '⚪';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button 
            variant="secondary" 
            size="sm"
            onClick={() => navigate('/department/tourism')}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Tourism Dashboard
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{tourist.name}</h1>
            <p className="text-gray-600">{tourist.nationality} • {tourist.passportNumber}</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-3xl">{getStatusIcon(tourist.status)}</span>
          <Badge variant={
            tourist.status === 'safe' ? 'success' : 
            tourist.status === 'warning' ? 'warning' : 
            tourist.status === 'danger' ? 'danger' : 'default'
          }>
            {tourist.status.toUpperCase()}
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Tourist Information */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center space-x-3">
                  <User className="h-5 w-5 text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-600">Full Name</p>
                    <p className="font-medium text-gray-900">{tourist.name}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Shield className="h-5 w-5 text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-600">Passport Number</p>
                    <p className="font-medium text-gray-900">{tourist.passportNumber}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Phone className="h-5 w-5 text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-600">Phone Number</p>
                    <p className="font-medium text-gray-900">{tourist.phoneNumber}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Mail className="h-5 w-5 text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-600">Email</p>
                    <p className="font-medium text-gray-900">{tourist.email}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Calendar className="h-5 w-5 text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-600">Arrival Date</p>
                    <p className="font-medium text-gray-900">{formatDate(tourist.arrivalDate)}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Calendar className="h-5 w-5 text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-600">Departure Date</p>
                    <p className="font-medium text-gray-900">{formatDate(tourist.departureDate)}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Current Location</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-3">
                <MapPin className="h-5 w-5 text-gray-500" />
                <div>
                  <p className="font-medium text-gray-900">{tourist.currentLocation.address}</p>
                  <p className="text-sm text-gray-600">
                    Last seen: {getTimeAgo(tourist.lastSeen)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Travel History</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {tourist.travelHistory.map((location, index) => (
                  <div key={location.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <MapPin className="h-4 w-4 text-gray-500" />
                      <div>
                        <p className="font-medium text-gray-900">{location.address}</p>
                        <p className="text-sm text-gray-600">{formatDate(location.timestamp)}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900">Safety Score: {location.safetyScore}</p>
                      <Badge variant={
                        location.riskLevel === 'low' ? 'success' :
                        location.riskLevel === 'medium' ? 'warning' : 'danger'
                      }>
                        {location.riskLevel}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Safety Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center">
                <div className="text-4xl font-bold text-gray-900 mb-2">{tourist.safetyScore}</div>
                <p className="text-sm text-gray-600 mb-4">Safety Score</p>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full ${
                      tourist.safetyScore >= 80 ? 'bg-success-500' :
                      tourist.safetyScore >= 60 ? 'bg-warning-500' :
                      tourist.safetyScore >= 40 ? 'bg-orange-500' : 'bg-danger-500'
                    }`}
                    style={{ width: `${tourist.safetyScore}%` }}
                  ></div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Tracking Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center space-x-2">
                {tourist.isTrackingEnabled ? (
                  <Eye className="h-5 w-5 text-success-500" />
                ) : (
                  <EyeOff className="h-5 w-5 text-gray-400" />
                )}
                <span className="font-medium text-gray-900">
                  Tracking {tourist.isTrackingEnabled ? 'Enabled' : 'Disabled'}
                </span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Emergency Contacts</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {tourist.emergencyContacts.map((contact) => (
                  <div key={contact.id} className="p-3 bg-gray-50 rounded-lg">
                    <p className="font-medium text-gray-900">{contact.name}</p>
                    <p className="text-sm text-gray-600">{contact.relationship}</p>
                    <p className="text-sm text-gray-600">{contact.phoneNumber}</p>
                    <p className="text-sm text-gray-600">{contact.email}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {tourist.status === 'missing' && (
            <Card className="border-danger-200 bg-danger-50">
              <CardHeader>
                <CardTitle className="text-danger-800">Missing Person Alert</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-2 text-danger-600">
                  <AlertTriangle className="h-5 w-5" />
                  <span className="text-sm">This tourist has been reported missing</span>
                </div>
                <Button variant="danger" className="w-full mt-4">
                  View Alert Details
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};
