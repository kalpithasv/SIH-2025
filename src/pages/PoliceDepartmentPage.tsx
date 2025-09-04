import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { AlertsPanel } from '../components/dashboard/AlertsPanel';
import { Heatmap } from '../components/dashboard/Heatmap';
import { mockTourists, mockAlerts, mockSafetyZones } from '../data/mockData';
import { Alert } from '../types';
import { Shield, AlertTriangle, MapPin, Clock, CheckCircle, ArrowLeft } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { useNavigate } from 'react-router-dom';

export const PoliceDepartmentPage: React.FC = () => {
  const navigate = useNavigate();

  const handleAlertSelect = (alert: Alert) => {
    console.log('Selected alert:', alert);
    // Navigate to alert details page
    navigate(`/alert/${alert.id}`);
  };

  const policeStats = {
    totalAlerts: mockAlerts.length,
    activeAlerts: mockAlerts.filter(a => a.status === 'active').length,
    investigatingAlerts: mockAlerts.filter(a => a.status === 'investigating').length,
    resolvedAlerts: mockAlerts.filter(a => a.status === 'resolved').length,
    averageResponseTime: '1.2h'
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button 
            variant="secondary" 
            size="sm"
            onClick={() => navigate('/')}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Police Department</h1>
            <p className="text-gray-600">Law Enforcement & Emergency Response</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Shield className="h-8 w-8 text-danger-600" />
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Alerts</p>
                <p className="text-2xl font-bold text-gray-900">{policeStats.totalAlerts}</p>
              </div>
              <div className="p-3 rounded-full bg-danger-100">
                <AlertTriangle className="h-6 w-6 text-danger-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Alerts</p>
                <p className="text-2xl font-bold text-danger-600">{policeStats.activeAlerts}</p>
              </div>
              <div className="p-3 rounded-full bg-danger-100">
                <AlertTriangle className="h-6 w-6 text-danger-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Investigating</p>
                <p className="text-2xl font-bold text-warning-600">{policeStats.investigatingAlerts}</p>
              </div>
              <div className="p-3 rounded-full bg-warning-100">
                <Clock className="h-6 w-6 text-warning-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Resolved</p>
                <p className="text-2xl font-bold text-success-600">{policeStats.resolvedAlerts}</p>
              </div>
              <div className="p-3 rounded-full bg-success-100">
                <CheckCircle className="h-6 w-6 text-success-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Alerts Panel */}
      <AlertsPanel
        alerts={mockAlerts}
        onAlertSelect={handleAlertSelect}
      />

      {/* Heatmap for Police View */}
      <Heatmap
        tourists={mockTourists}
        safetyZones={mockSafetyZones}
      />

      {/* Emergency Response Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Response Time Analysis</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Average Response Time</span>
                <span className="font-semibold text-gray-900">{policeStats.averageResponseTime}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Critical Alerts (24h)</span>
                <span className="font-semibold text-danger-600">
                  {mockAlerts.filter(a => a.severity === 'critical').length}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">High Priority Alerts</span>
                <span className="font-semibold text-warning-600">
                  {mockAlerts.filter(a => a.severity === 'high').length}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Officer Assignments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {mockAlerts
                .filter(alert => alert.assignedTo)
                .map(alert => (
                  <div key={alert.id} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{alert.assignedTo}</p>
                      <p className="text-xs text-gray-600">{alert.touristName}</p>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      alert.severity === 'critical' ? 'bg-danger-100 text-danger-800' :
                      alert.severity === 'high' ? 'bg-warning-100 text-warning-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {alert.severity}
                    </span>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
