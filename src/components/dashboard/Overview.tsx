import React from 'react';
import { 
  Users, 
  AlertTriangle, 
  Shield, 
  TrendingUp,
  MapPin,
  Clock,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { StatsCard } from './StatsCard';
import { DepartmentCard } from './DepartmentCard';
import { DashboardStats } from '../../types';

interface OverviewProps {
  stats: DashboardStats;
  onDepartmentSelect: (department: 'tourism' | 'police') => void;
}

export const Overview: React.FC<OverviewProps> = ({ stats, onDepartmentSelect }) => {
  const tourismStats = {
    totalTourists: stats.totalTourists,
    activeAlerts: stats.activeAlerts,
    resolvedCases: stats.resolvedAlerts,
    averageResponseTime: '2.5h'
  };

  const policeStats = {
    totalTourists: stats.totalTourists,
    activeAlerts: stats.activeAlerts,
    resolvedCases: stats.resolvedAlerts,
    averageResponseTime: '1.2h'
  };

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Tourists"
          value={stats.totalTourists}
          change="+12% from last week"
          changeType="positive"
          icon={Users}
          color="blue"
        />
        <StatsCard
          title="Active Alerts"
          value={stats.activeAlerts}
          change="+3 new alerts"
          changeType="negative"
          icon={AlertTriangle}
          color="red"
        />
        <StatsCard
          title="Average Safety Score"
          value={`${stats.averageSafetyScore}%`}
          change="+5% improvement"
          changeType="positive"
          icon={Shield}
          color="green"
        />
        <StatsCard
          title="Resolved Cases"
          value={stats.resolvedAlerts}
          change="+8 this week"
          changeType="positive"
          icon={CheckCircle}
          color="purple"
        />
      </div>

      {/* Department Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <DepartmentCard
          department="tourism"
          stats={tourismStats}
          onViewDetails={() => onDepartmentSelect('tourism')}
        />
        <DepartmentCard
          department="police"
          stats={policeStats}
          onViewDetails={() => onDepartmentSelect('police')}
        />
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Safe Tourists</p>
              <p className="text-3xl font-bold text-success-600">{stats.safeTourists}</p>
            </div>
            <div className="p-3 rounded-full bg-success-100">
              <CheckCircle className="h-6 w-6 text-success-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Warning Status</p>
              <p className="text-3xl font-bold text-warning-600">{stats.warningTourists}</p>
            </div>
            <div className="p-3 rounded-full bg-warning-100">
              <AlertTriangle className="h-6 w-6 text-warning-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Missing Tourists</p>
              <p className="text-3xl font-bold text-danger-600">{stats.missingTourists}</p>
            </div>
            <div className="p-3 rounded-full bg-danger-100">
              <XCircle className="h-6 w-6 text-danger-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
        <div className="space-y-4">
          <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
            <div className="p-2 rounded-full bg-success-100">
              <CheckCircle className="h-4 w-4 text-success-600" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900">Sarah Johnson case resolved</p>
              <p className="text-xs text-gray-600">Missing person found safe in Jaipur</p>
            </div>
            <span className="text-xs text-gray-500">2 hours ago</span>
          </div>
          
          <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
            <div className="p-2 rounded-full bg-warning-100">
              <AlertTriangle className="h-4 w-4 text-warning-600" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900">New geofence alert</p>
              <p className="text-xs text-gray-600">Maria Garcia entered restricted zone</p>
            </div>
            <span className="text-xs text-gray-500">4 hours ago</span>
          </div>
          
          <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
            <div className="p-2 rounded-full bg-primary-100">
              <Users className="h-4 w-4 text-primary-600" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900">New tourist registered</p>
              <p className="text-xs text-gray-600">John Smith from USA</p>
            </div>
            <span className="text-xs text-gray-500">6 hours ago</span>
          </div>
        </div>
      </div>
    </div>
  );
};
