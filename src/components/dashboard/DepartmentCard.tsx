import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { Globe, Users, AlertTriangle, MapPin } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface DepartmentCardProps {
  department: 'tourism' | 'police';
  stats: {
    totalTourists: number;
    activeAlerts: number;
    resolvedCases: number;
    averageResponseTime: string;
  };
  onViewDetails?: () => void;
}

export const DepartmentCard: React.FC<DepartmentCardProps> = ({
  department,
  stats
}) => {
  const navigate = useNavigate();
  const isTourism = department === 'tourism';

  const handleViewDetails = () => {
    navigate(`/dashboard/department/${department}`);
  };
  
  const departmentInfo = {
    tourism: {
      title: 'Ministry of Tourism',
      icon: Globe,
      color: 'text-primary-600 bg-primary-100',
      description: 'Tourist Management & Safety'
    },
    police: {
      title: 'Police Department',
      icon: AlertTriangle,
      color: 'text-danger-600 bg-danger-100',
      description: 'Law Enforcement & Emergency Response'
    }
  };

  const info = departmentInfo[department];
  const Icon = info.icon;

  return (
    <Card className="hover:shadow-lg transition-shadow duration-300">
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between space-y-3 sm:space-y-0">
          <div className="flex items-center space-x-3">
            <div className={`p-2 sm:p-3 rounded-full ${info.color}`}>
              <Icon className="h-5 w-5 sm:h-6 sm:w-6" />
            </div>
            <div className="min-w-0 flex-1">
              <CardTitle className="text-lg sm:text-xl">{info.title}</CardTitle>
              <p className="text-xs sm:text-sm text-gray-600">{info.description}</p>
            </div>
          </div>
          <div className="flex-shrink-0">
            <Badge variant={isTourism ? 'info' : 'danger'}>
              {isTourism ? 'Tourism' : 'Police'}
            </Badge>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-4 sm:mb-6">
          <div className="text-center p-2 sm:p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-center space-x-1 sm:space-x-2 mb-1">
              <Users className="h-3 w-3 sm:h-4 sm:w-4 text-gray-500" />
              <span className="text-xs sm:text-sm text-gray-600">Total Tourists</span>
            </div>
            <p className="text-lg sm:text-2xl font-bold text-gray-900">{stats.totalTourists}</p>
          </div>
          
          <div className="text-center p-2 sm:p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-center space-x-1 sm:space-x-2 mb-1">
              <AlertTriangle className="h-3 w-3 sm:h-4 sm:w-4 text-gray-500" />
              <span className="text-xs sm:text-sm text-gray-600">Active Alerts</span>
            </div>
            <p className="text-lg sm:text-2xl font-bold text-gray-900">{stats.activeAlerts}</p>
          </div>
          
          <div className="text-center p-2 sm:p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-center space-x-1 sm:space-x-2 mb-1">
              <MapPin className="h-3 w-3 sm:h-4 sm:w-4 text-gray-500" />
              <span className="text-xs sm:text-sm text-gray-600">Resolved Cases</span>
            </div>
            <p className="text-lg sm:text-2xl font-bold text-gray-900">{stats.resolvedCases}</p>
          </div>
          
          <div className="text-center p-2 sm:p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-center space-x-1 sm:space-x-2 mb-1">
              <MapPin className="h-3 w-3 sm:h-4 sm:w-4 text-gray-500" />
              <span className="text-xs sm:text-sm text-gray-600">Avg Response</span>
            </div>
            <p className="text-lg sm:text-2xl font-bold text-gray-900">{stats.averageResponseTime}</p>
          </div>
        </div>
        
        <Button 
          variant={isTourism ? 'primary' : 'danger'} 
          className="w-full"
          onClick={handleViewDetails}
        >
          View Dashboard
        </Button>
      </CardContent>
    </Card>
  );
};
