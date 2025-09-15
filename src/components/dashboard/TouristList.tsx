import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Tourist } from '../../types';
import { formatDate, getTimeAgo } from '../../utils';
import { MapPin, Phone, Eye, EyeOff } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface TouristListProps {
  tourists: Tourist[];
  onTouristSelect: (tourist: Tourist) => void;
}

export const TouristList: React.FC<TouristListProps> = ({ tourists }) => {
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
        <div className="flex flex-col sm:flex-row sm:items-center justify-between space-y-3 sm:space-y-0">
          <CardTitle>Tourist List</CardTitle>
          <div className="flex flex-col xs:flex-row gap-2">
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value as any)}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm min-h-[40px] flex-1 xs:flex-none"
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
              className="px-3 py-2 border border-gray-300 rounded-md text-sm min-h-[40px] flex-1 xs:flex-none"
            >
              <option value="safetyScore">Safety Score</option>
              <option value="name">Name</option>
              <option value="lastSeen">Last Seen</option>
            </select>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-3 sm:space-y-4">
          {sortedTourists.map((tourist) => (
            <div
              key={tourist.id}
              className="border border-gray-200 rounded-lg p-3 sm:p-4 hover:bg-gray-50 transition-colors duration-200 cursor-pointer touch-manipulation"
              onClick={() => handleTouristClick(tourist)}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between space-y-3 sm:space-y-0 mb-3">
                <div className="flex items-center space-x-3 min-w-0 flex-1">
                  <span className="text-xl sm:text-2xl flex-shrink-0">{getStatusIcon(tourist.status)}</span>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-semibold text-gray-900 truncate">{tourist.name}</h3>
                    <p className="text-xs sm:text-sm text-gray-600 truncate">{tourist.nationality} • {tourist.passportNumber}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between sm:justify-end space-x-3 sm:space-x-2 flex-shrink-0">
                  <Badge variant={tourist.status === 'safe' ? 'success' : 
                                 tourist.status === 'warning' ? 'warning' : 
                                 tourist.status === 'danger' ? 'danger' : 'default'}>
                    {tourist.status.toUpperCase()}
                  </Badge>
                  <div className="text-right">
                    <p className="text-xs sm:text-sm font-medium text-gray-900">Safety Score</p>
                    <p className="text-base sm:text-lg font-bold text-gray-900">{tourist.safetyScore}</p>
                  </div>
                </div>
              </div>
              
              <div className="space-y-2 sm:space-y-0 sm:grid sm:grid-cols-1 md:grid-cols-3 sm:gap-4 text-xs sm:text-sm">
                <div className="flex items-center space-x-2 min-w-0">
                  <MapPin className="h-3 w-3 sm:h-4 sm:w-4 text-gray-500 flex-shrink-0" />
                  <span className="text-gray-600 truncate">{tourist.currentLocation.address}</span>
                </div>
                <div className="flex items-center space-x-2 min-w-0">
                  <Phone className="h-3 w-3 sm:h-4 sm:w-4 text-gray-500 flex-shrink-0" />
                  <span className="text-gray-600">{tourist.phoneNumber}</span>
                </div>
                <div className="flex items-center space-x-2 min-w-0">
                  {tourist.isTrackingEnabled ? (
                    <Eye className="h-3 w-3 sm:h-4 sm:w-4 text-success-500 flex-shrink-0" />
                  ) : (
                    <EyeOff className="h-3 w-3 sm:h-4 sm:w-4 text-gray-400 flex-shrink-0" />
                  )}
                  <span className="text-gray-600">
                    Tracking {tourist.isTrackingEnabled ? 'Enabled' : 'Disabled'}
                  </span>
                </div>
              </div>
              
              <div className="mt-3 pt-3 border-t border-gray-200">
                <div className="flex flex-col xs:flex-row xs:items-center xs:justify-between space-y-1 xs:space-y-0 text-xs sm:text-sm text-gray-600">
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
