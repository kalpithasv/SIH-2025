import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { TouristList } from '../components/dashboard/TouristList';
import { SafetyScoreChart } from '../components/dashboard/SafetyScoreChart';
import { Heatmap } from '../components/dashboard/Heatmap';
import { mockTourists, mockSafetyZones } from '../data/mockData';
import { Tourist } from '../types';
import { Users, MapPin, BarChart3, Globe, ArrowLeft } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { useNavigate } from 'react-router-dom';

export const TourismDepartmentPage: React.FC = () => {
  const navigate = useNavigate();

  const handleTouristSelect = (tourist: Tourist) => {
    console.log('Selected tourist:', tourist);
    // Navigate to tourist details page
    navigate(`/tourist/${tourist.id}`);
  };

  const tourismStats = {
    totalTourists: mockTourists.length,
    activeTourists: mockTourists.filter(t => t.status === 'safe').length,
    warningTourists: mockTourists.filter(t => t.status === 'warning').length,
    averageSafetyScore: Math.round(
      mockTourists.reduce((sum, t) => sum + t.safetyScore, 0) / mockTourists.length
    )
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
            <h1 className="text-3xl font-bold text-gray-900">Ministry of Tourism</h1>
            <p className="text-gray-600">Tourist Management & Safety Monitoring</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Globe className="h-8 w-8 text-primary-600" />
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Tourists</p>
                <p className="text-2xl font-bold text-gray-900">{tourismStats.totalTourists}</p>
              </div>
              <div className="p-3 rounded-full bg-primary-100">
                <Users className="h-6 w-6 text-primary-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Tourists</p>
                <p className="text-2xl font-bold text-success-600">{tourismStats.activeTourists}</p>
              </div>
              <div className="p-3 rounded-full bg-success-100">
                <Users className="h-6 w-6 text-success-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Warning Status</p>
                <p className="text-2xl font-bold text-warning-600">{tourismStats.warningTourists}</p>
              </div>
              <div className="p-3 rounded-full bg-warning-100">
                <Users className="h-6 w-6 text-warning-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg Safety Score</p>
                <p className="text-2xl font-bold text-gray-900">{tourismStats.averageSafetyScore}%</p>
              </div>
              <div className="p-3 rounded-full bg-gray-100">
                <BarChart3 className="h-6 w-6 text-gray-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tourist List */}
      <TouristList
        tourists={mockTourists}
        onTouristSelect={handleTouristSelect}
      />

      {/* Charts and Analytics */}
      <SafetyScoreChart tourists={mockTourists} />

      {/* Heatmap */}
      <Heatmap
        tourists={mockTourists}
        safetyZones={mockSafetyZones}
      />
    </div>
  );
};
