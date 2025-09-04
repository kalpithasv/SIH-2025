import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { Shield, Users, AlertTriangle, MapPin } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface DepartmentCardProps {
  department: 'tourism' | 'police';
  stats: {
    totalTourists: number;
    activeAlerts: number;
    resolvedCases: number;
    averageResponseTime: string;
  };
  onViewDetails: () => void;
}

export const DepartmentCard: React.FC<DepartmentCardProps> = ({
  department,
  stats
}) => {
  const navigate = useNavigate();
  const isTourism = department === 'tourism';

  const handleViewDetails = () => {
    navigate(`/department/${department}`);
  };
  
  const departmentInfo = {
    tourism: {
      title: 'Ministry of Tourism',
      icon: Users,
      color: 'text-primary-600 bg-primary-100',
      description: 'Tourist Management & Safety'
    },
    police: {
      title: 'Police Department',
      icon: Shield,
      color: 'text-danger-600 bg-danger-100',
      description: 'Law Enforcement & Emergency Response'
    }
  };

  const info = departmentInfo[department];
  const Icon = info.icon;

  return (
    <Card className="hover:shadow-lg transition-shadow duration-300">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className={`p-3 rounded-full ${info.color}`}>
              <Icon className="h-6 w-6" />
            </div>
            <div>
              <CardTitle className="text-xl">{info.title}</CardTitle>
              <p className="text-sm text-gray-600">{info.description}</p>
            </div>
          </div>
          <Badge variant={isTourism ? 'info' : 'danger'}>
            {isTourism ? 'Tourism' : 'Police'}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-2 mb-1">
              <Users className="h-4 w-4 text-gray-500" />
              <span className="text-sm text-gray-600">Total Tourists</span>
            </div>
            <p className="text-2xl font-bold text-gray-900">{stats.totalTourists}</p>
          </div>
          
          <div className="text-center">
            <div className="flex items-center justify-center space-x-2 mb-1">
              <AlertTriangle className="h-4 w-4 text-gray-500" />
              <span className="text-sm text-gray-600">Active Alerts</span>
            </div>
            <p className="text-2xl font-bold text-gray-900">{stats.activeAlerts}</p>
          </div>
          
          <div className="text-center">
            <div className="flex items-center justify-center space-x-2 mb-1">
              <MapPin className="h-4 w-4 text-gray-500" />
              <span className="text-sm text-gray-600">Resolved Cases</span>
            </div>
            <p className="text-2xl font-bold text-gray-900">{stats.resolvedCases}</p>
          </div>
          
          <div className="text-center">
            <div className="flex items-center justify-center space-x-2 mb-1">
              <Shield className="h-4 w-4 text-gray-500" />
              <span className="text-sm text-gray-600">Avg Response</span>
            </div>
            <p className="text-2xl font-bold text-gray-900">{stats.averageResponseTime}</p>
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
