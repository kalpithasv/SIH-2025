import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Alert } from '../types';
import { mockAlerts } from '../data/mockData';
import { 
  ArrowLeft, 
  MapPin, 
  Clock, 
  User, 
  AlertTriangle,
  Phone,
  Mail,
  Shield,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';
import { formatDate, getSeverityColor } from '../utils';

export const AlertDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const alert = mockAlerts.find(a => a.id === id);

  if (!alert) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Alert Not Found</h2>
          <p className="text-gray-600 mb-4">The requested alert could not be found.</p>
          <Button onClick={() => navigate('/department/police')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Police Dashboard
          </Button>
        </div>
      </div>
    );
  }

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'panic':
        return '🚨';
      case 'geofence':
        return '🚧';
      case 'anomaly':
        return '⚠️';
      case 'missing':
        return '❓';
      default:
        return '📢';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <AlertTriangle className="h-5 w-5 text-danger-500" />;
      case 'investigating':
        return <Clock className="h-5 w-5 text-warning-500" />;
      case 'resolved':
        return <CheckCircle className="h-5 w-5 text-success-500" />;
      default:
        return <XCircle className="h-5 w-5 text-gray-500" />;
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
            onClick={() => navigate('/department/police')}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Police Dashboard
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Alert Details</h1>
            <p className="text-gray-600">Alert ID: {alert.id}</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-3xl">{getAlertIcon(alert.type)}</span>
          <Badge variant={
            alert.severity === 'critical' ? 'danger' :
            alert.severity === 'high' ? 'danger' :
            alert.severity === 'medium' ? 'warning' : 'success'
          }>
            {alert.severity.toUpperCase()}
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Alert Information */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Alert Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-600">Alert Type</span>
                  <Badge variant="info">{alert.type.toUpperCase()}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-600">Severity</span>
                  <Badge variant={
                    alert.severity === 'critical' ? 'danger' :
                    alert.severity === 'high' ? 'danger' :
                    alert.severity === 'medium' ? 'warning' : 'success'
                  }>
                    {alert.severity.toUpperCase()}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-600">Status</span>
                  <div className="flex items-center space-x-2">
                    {getStatusIcon(alert.status)}
                    <span className="capitalize">{alert.status}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-600">Timestamp</span>
                  <span className="text-sm text-gray-900">{formatDate(alert.timestamp)}</span>
                </div>
                {alert.assignedTo && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-600">Assigned To</span>
                    <span className="text-sm text-gray-900">{alert.assignedTo}</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Alert Message</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700">{alert.message}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Location Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-3">
                <MapPin className="h-5 w-5 text-gray-500" />
                <div>
                  <p className="font-medium text-gray-900">{alert.location.address}</p>
                  <p className="text-sm text-gray-600">
                    Coordinates: {alert.location.lat.toFixed(4)}, {alert.location.lng.toFixed(4)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Tourist Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <User className="h-5 w-5 text-gray-500" />
                  <div>
                    <p className="font-medium text-gray-900">{alert.touristName}</p>
                    <p className="text-sm text-gray-600">Tourist ID: {alert.touristId}</p>
                  </div>
                </div>
                <Button 
                  variant="primary" 
                  onClick={() => navigate(`/tourist/${alert.touristId}`)}
                >
                  View Tourist Details
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {alert.status === 'active' && (
                  <>
                    <Button variant="warning" className="w-full">
                      <Clock className="h-4 w-4 mr-2" />
                      Start Investigation
                    </Button>
                    <Button variant="danger" className="w-full">
                      <AlertTriangle className="h-4 w-4 mr-2" />
                      Escalate Alert
                    </Button>
                  </>
                )}
                {alert.status === 'investigating' && (
                  <>
                    <Button variant="success" className="w-full">
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Mark as Resolved
                    </Button>
                    <Button variant="secondary" className="w-full">
                      <User className="h-4 w-4 mr-2" />
                      Assign Officer
                    </Button>
                  </>
                )}
                <Button variant="secondary" className="w-full">
                  <Phone className="h-4 w-4 mr-2" />
                  Contact Tourist
                </Button>
                <Button variant="secondary" className="w-full">
                  <Mail className="h-4 w-4 mr-2" />
                  Send Update
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Alert Timeline</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-danger-500 rounded-full mt-2"></div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Alert Created</p>
                    <p className="text-xs text-gray-600">{formatDate(alert.timestamp)}</p>
                  </div>
                </div>
                {alert.assignedTo && (
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-warning-500 rounded-full mt-2"></div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">Assigned to Officer</p>
                      <p className="text-xs text-gray-600">{alert.assignedTo}</p>
                    </div>
                  </div>
                )}
                {alert.status === 'resolved' && (
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-success-500 rounded-full mt-2"></div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">Alert Resolved</p>
                      <p className="text-xs text-gray-600">Recently</p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Emergency Contacts</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="font-medium text-gray-900">Emergency Hotline</p>
                  <p className="text-sm text-gray-600">100 (Police)</p>
                  <p className="text-sm text-gray-600">108 (Ambulance)</p>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="font-medium text-gray-900">Tourist Helpline</p>
                  <p className="text-sm text-gray-600">1800-11-1363</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
