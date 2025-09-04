import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { Tourist } from '../../types';
import { formatDate, getStatusColor, getTimeAgo } from '../../utils';
import { MapPin, Phone, Mail, Eye, EyeOff, AlertTriangle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface TouristListProps {
  tourists: Tourist[];
  onTouristSelect: (tourist: Tourist) => void;
}

export const TouristList: React.FC<TouristListProps> = ({ tourists, onTouristSelect }) => {
  const navigate = useNavigate();
  const [filter, setFilter] = useState<'all' | 'safe' | 'warning' | 'danger' | 'missing'>('all');
  const [sortBy, setSortBy] = useState<'name' | 'safetyScore' | 'lastSeen'>('safetyScore');

  const handleTouristClick = (tourist: Tourist) => {
    navigate(`/tourist/${tourist.id}`);
  };

  const filteredTourists = tourists.filter(tourist => 
    filter === 'all' || tourist.status === filter
  );

  const sortedTourists = [...filteredTourists].sort((a, b) => {
    switch (sortBy) {
      case 'name':
        return a.name.localeCompare(b.name);
      case 'safetyScore':
        return b.safetyScore - a.safetyScore;
      case 'lastSeen':
        return new Date(b.lastSeen).getTime() - new Date(a.lastSeen).getTime();
      default:
        return 0;
    }
  });

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
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Tourist List</CardTitle>
          <div className="flex space-x-2">
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value as any)}
              className="px-3 py-1 border border-gray-300 rounded-md text-sm"
            >
              <option value="all">All Status</option>
              <option value="safe">Safe</option>
              <option value="warning">Warning</option>
              <option value="danger">Danger</option>
              <option value="missing">Missing</option>
            </select>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-3 py-1 border border-gray-300 rounded-md text-sm"
            >
              <option value="safetyScore">Safety Score</option>
              <option value="name">Name</option>
              <option value="lastSeen">Last Seen</option>
            </select>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-4">
          {sortedTourists.map((tourist) => (
            <div
              key={tourist.id}
              className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors duration-200 cursor-pointer"
              onClick={() => handleTouristClick(tourist)}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">{getStatusIcon(tourist.status)}</span>
                  <div>
                    <h3 className="font-semibold text-gray-900">{tourist.name}</h3>
                    <p className="text-sm text-gray-600">{tourist.nationality} • {tourist.passportNumber}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant={tourist.status === 'safe' ? 'success' : 
                                 tourist.status === 'warning' ? 'warning' : 
                                 tourist.status === 'danger' ? 'danger' : 'default'}>
                    {tourist.status.toUpperCase()}
                  </Badge>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">Safety Score</p>
                    <p className="text-lg font-bold text-gray-900">{tourist.safetyScore}</p>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div className="flex items-center space-x-2">
                  <MapPin className="h-4 w-4 text-gray-500" />
                  <span className="text-gray-600">{tourist.currentLocation.address}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Phone className="h-4 w-4 text-gray-500" />
                  <span className="text-gray-600">{tourist.phoneNumber}</span>
                </div>
                <div className="flex items-center space-x-2">
                  {tourist.isTrackingEnabled ? (
                    <Eye className="h-4 w-4 text-success-500" />
                  ) : (
                    <EyeOff className="h-4 w-4 text-gray-400" />
                  )}
                  <span className="text-gray-600">
                    Tracking {tourist.isTrackingEnabled ? 'Enabled' : 'Disabled'}
                  </span>
                </div>
              </div>
              
              <div className="mt-3 pt-3 border-t border-gray-200">
                <div className="flex items-center justify-between text-sm text-gray-600">
                  <span>Last seen: {getTimeAgo(tourist.lastSeen)}</span>
                  <span>Arrival: {formatDate(tourist.arrivalDate)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
