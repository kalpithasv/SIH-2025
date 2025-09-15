import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { AcknowledgeModal } from '../ui/AcknowledgeModal';
import { Alert } from '../../types';
import { formatDate } from '../../utils';
import { AlertTriangle, MapPin, Clock, User, CheckCircle, Eye, MessageSquare } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import apiService from '../../services/api';

interface AlertsPanelProps {
  alerts: Alert[];
  onAlertSelect: (alert: Alert) => void;
  onAlertUpdate?: () => void; // Callback to refresh alerts after acknowledgment
}

export const AlertsPanel: React.FC<AlertsPanelProps> = ({ alerts, onAlertUpdate }) => {
  const navigate = useNavigate();
  const [filter, setFilter] = useState<'all' | 'active' | 'investigating' | 'resolved'>('all');
  const [severityFilter, setSeverityFilter] = useState<'all' | 'low' | 'medium' | 'high' | 'critical'>('all');
  
  // Acknowledge modal state
  const [acknowledgeModal, setAcknowledgeModal] = useState<{
    isOpen: boolean;
    alert: Alert | null;
  }>({ isOpen: false, alert: null });
  const [isAcknowledging, setIsAcknowledging] = useState(false);

  const handleAlertClick = (alert: Alert) => {
    navigate(`/alert/${alert.id}`);
  };

  const handleAcknowledgeClick = (e: React.MouseEvent, alert: Alert) => {
    console.log('🖘 Acknowledge button clicked for alert:', alert);
    e.stopPropagation(); // Prevent navigation to alert details
    setAcknowledgeModal({ isOpen: true, alert });
    console.log('📱 Modal state set to open');
  };

  const handleAcknowledgeConfirm = async (comment: string, action: 'acknowledge' | 'resolve' | 'false_alarm' = 'acknowledge') => {
    console.log('🚀 handleAcknowledgeConfirm called with:', { comment, action, alert: acknowledgeModal.alert });
    
    if (!acknowledgeModal.alert) {
      console.error('❌ No alert in modal state');
      return;
    }

    console.log('⏳ Setting acknowledging state to true');
    setIsAcknowledging(true);
    
    try {
      console.log(`🚨 About to ${action} alert:`, {
        alertId: acknowledgeModal.alert.id,
        alertType: acknowledgeModal.alert.type,
        comment,
        action
      });
      
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
      
      console.log(`✅ Alert ${action}d successfully`);
      
      // Close modal
      setAcknowledgeModal({ isOpen: false, alert: null });
      
      // Refresh alerts if callback provided
      if (onAlertUpdate) {
        onAlertUpdate();
      }
      
    } catch (error) {
      console.error(`❌ Failed to ${action} alert:`, error);
      alert(`Failed to ${action} alert. Please try again.`);
    } finally {
      setIsAcknowledging(false);
    }
  };

  const handleAcknowledgeCancel = () => {
    setAcknowledgeModal({ isOpen: false, alert: null });
  };

  const filteredAlerts = alerts.filter(alert => {
    const statusMatch = filter === 'all' || alert.status === filter;
    const severityMatch = severityFilter === 'all' || alert.severity === severityFilter;
    return statusMatch && severityMatch;
  });
  
  // Debug: Log filtered alerts
  console.log('🚨 AlertsPanel: Total alerts:', alerts.length);
  console.log('🚨 AlertsPanel: Filtered alerts:', filteredAlerts.length);
  console.log('🚨 AlertsPanel: Active alerts:', filteredAlerts.filter(a => a.status === 'active').length);
  if (filteredAlerts.length > 0) {
    console.log('🚨 AlertsPanel: First alert sample:', filteredAlerts[0]);
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
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case 'investigating':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'resolved':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      default:
        return <AlertTriangle className="h-4 w-4 text-gray-500" />;
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between space-y-3 sm:space-y-0">
          <CardTitle>Active Alerts & Incidents</CardTitle>
          <div className="flex flex-col xs:flex-row gap-2">
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value as any)}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm min-h-[40px] flex-1 xs:flex-none"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="investigating">Investigating</option>
              <option value="resolved">Resolved</option>
            </select>
            <select
              value={severityFilter}
              onChange={(e) => setSeverityFilter(e.target.value as any)}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm min-h-[40px] flex-1 xs:flex-none"
            >
              <option value="all">All Severity</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="critical">Critical</option>
            </select>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-3 sm:space-y-4">
          {filteredAlerts.length === 0 ? (
            <div className="text-center py-6 sm:py-8 text-gray-500">
              <AlertTriangle className="h-10 w-10 sm:h-12 sm:w-12 mx-auto mb-3 sm:mb-4 text-gray-300" />
              <p className="text-sm sm:text-base">No alerts found matching the current filters.</p>
            </div>
          ) : (
            filteredAlerts.map((alert) => (
              <div
                key={alert.id}
                className="border border-gray-200 rounded-lg p-3 sm:p-4 hover:bg-gray-50 transition-colors duration-200 cursor-pointer touch-manipulation"
                onClick={() => handleAlertClick(alert)}
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between space-y-3 sm:space-y-0 mb-3">
                  <div className="flex items-center space-x-3 min-w-0 flex-1">
                    <span className="text-xl sm:text-2xl flex-shrink-0">{getAlertIcon(alert.type)}</span>
                    <div className="min-w-0 flex-1">
                      <h3 className="font-semibold text-gray-900 truncate">{alert.touristName}</h3>
                      <p className="text-xs sm:text-sm text-gray-600 capitalize">{alert.type} Alert</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between sm:justify-end space-x-3 sm:space-x-2 flex-shrink-0">
                    <Badge variant={
                      alert.severity === 'critical' ? 'danger' :
                      alert.severity === 'high' ? 'danger' :
                      alert.severity === 'medium' ? 'warning' : 'success'
                    }>
                      {alert.severity.toUpperCase()}
                    </Badge>
                    <div className="flex items-center space-x-1">
                      {getStatusIcon(alert.status)}
                      <span className="text-xs sm:text-sm text-gray-600 capitalize">{alert.status}</span>
                    </div>
                  </div>
                </div>
                
                <p className="text-xs sm:text-sm text-gray-700 mb-3 overflow-hidden" style={{display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical'}}>{alert.message}</p>
                
                <div className="space-y-2 sm:space-y-0 sm:grid sm:grid-cols-1 md:grid-cols-2 sm:gap-4 text-xs sm:text-sm">
                  <div className="flex items-center space-x-2 min-w-0">
                    <MapPin className="h-3 w-3 sm:h-4 sm:w-4 text-gray-500 flex-shrink-0" />
                    <span className="text-gray-600 truncate">{alert.location.address}</span>
                  </div>
                  <div className="flex items-center space-x-2 min-w-0">
                    <Clock className="h-3 w-3 sm:h-4 sm:w-4 text-gray-500 flex-shrink-0" />
                    <span className="text-gray-600">{formatDate(alert.timestamp)}</span>
                  </div>
                  {alert.assignedTo && (
                    <div className="flex items-center space-x-2 md:col-span-2 min-w-0">
                      <User className="h-3 w-3 sm:h-4 sm:w-4 text-gray-500 flex-shrink-0" />
                      <span className="text-gray-600 truncate">Assigned to: {alert.assignedTo}</span>
                    </div>
                  )}
                </div>
                
                <div className="mt-3 pt-3 border-t border-gray-200 flex flex-col xs:flex-row xs:items-center justify-between space-y-2 xs:space-y-0">
                  <div className="flex space-x-2">
                    {alert.status === 'active' && (
                      <Button 
                        size="sm" 
                        variant="warning"
                        onClick={(e) => handleAcknowledgeClick(e, alert)}
                        className="flex-1 xs:flex-none"
                      >
                        <MessageSquare className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                        <span className="text-xs sm:text-sm">Acknowledge</span>
                      </Button>
                    )}
                  </div>
                  <Button size="sm" variant="secondary" className="flex-1 xs:flex-none">
                    <Eye className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                    <span className="text-xs sm:text-sm">View Details</span>
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
      
      {/* Acknowledge Modal */}
      <AcknowledgeModal
        isOpen={acknowledgeModal.isOpen}
        alertType={acknowledgeModal.alert?.type === 'panic' ? 'SOS' : 'Community Report'}
        alertTitle={acknowledgeModal.alert ? `${acknowledgeModal.alert.touristName} - ${acknowledgeModal.alert.type} Alert` : ''}
        onConfirm={handleAcknowledgeConfirm}
        onCancel={handleAcknowledgeCancel}
        isLoading={isAcknowledging}
      />
    </Card>
  );
};
