import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { MapContainer, TileLayer, CircleMarker, Popup, Polygon } from 'react-leaflet';
import { Tourist, SafetyZone } from '../../types';
import { Badge } from '../ui/Badge';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default markers in react-leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface HeatmapProps {
  tourists: Tourist[];
  safetyZones: SafetyZone[];
}

export const Heatmap: React.FC<HeatmapProps> = ({ tourists, safetyZones }) => {
  const mapCenter: [number, number] = [20.5937, 78.9629]; // India center
  const mapZoom = 5;

  // Calculate tourist density by location
  const locationDensity = tourists.reduce((acc, tourist) => {
    const key = `${tourist.currentLocation.lat.toFixed(2)},${tourist.currentLocation.lng.toFixed(2)}`;
    if (!acc[key]) {
      acc[key] = {
        lat: tourist.currentLocation.lat,
        lng: tourist.currentLocation.lng,
        count: 0,
        tourists: [],
        averageScore: 0
      };
    }
    acc[key].count += 1;
    acc[key].tourists.push(tourist);
    return acc;
  }, {} as Record<string, any>);

  // Calculate average safety score for each location
  Object.values(locationDensity).forEach((location: any) => {
    location.averageScore = Math.round(
      location.tourists.reduce((sum: number, t: Tourist) => sum + t.safetyScore, 0) / location.tourists.length
    );
  });

  const getMarkerColor = (score: number) => {
    if (score >= 80) return '#22c55e'; // Green
    if (score >= 60) return '#f59e0b'; // Yellow
    if (score >= 40) return '#f97316'; // Orange
    return '#ef4444'; // Red
  };

  const getZoneColor = (type: string) => {
    switch (type) {
      case 'safe': return '#22c55e';
      case 'warning': return '#f59e0b';
      case 'restricted': return '#ef4444';
      default: return '#6b7280';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Tourist Location Heatmap & Safety Zones</CardTitle>
        <div className="flex flex-wrap gap-2 mt-2">
          <Badge variant="success">🟢 Safe Zone</Badge>
          <Badge variant="warning">🟡 Warning Zone</Badge>
          <Badge variant="danger">🔴 Restricted Zone</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-96 w-full rounded-lg overflow-hidden">
          <MapContainer
            center={mapCenter}
            zoom={mapZoom}
            style={{ height: '100%', width: '100%' }}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            
            {/* Safety Zones */}
            {safetyZones.map((zone) => (
              <Polygon
                key={zone.id}
                positions={zone.coordinates}
                pathOptions={{
                  color: getZoneColor(zone.type),
                  fillColor: getZoneColor(zone.type),
                  fillOpacity: 0.3,
                  weight: 2
                }}
              >
                <Popup>
                  <div className="p-2">
                    <h3 className="font-semibold text-lg">{zone.name}</h3>
                    <p className="text-sm text-gray-600 mb-2">{zone.description}</p>
                    <Badge variant={zone.type === 'safe' ? 'success' : 
                                   zone.type === 'warning' ? 'warning' : 'danger'}>
                      {zone.type.toUpperCase()}
                    </Badge>
                    <p className="text-xs text-gray-500 mt-1">
                      Risk Level: {zone.riskLevel}/10
                    </p>
                  </div>
                </Popup>
              </Polygon>
            ))}
            
            {/* Tourist Locations */}
            {Object.values(locationDensity).map((location: any, index) => (
              <CircleMarker
                key={index}
                center={[location.lat, location.lng]}
                radius={Math.max(8, Math.min(20, location.count * 3))}
                pathOptions={{
                  color: getMarkerColor(location.averageScore),
                  fillColor: getMarkerColor(location.averageScore),
                  fillOpacity: 0.7,
                  weight: 2
                }}
              >
                <Popup>
                  <div className="p-2">
                    <h3 className="font-semibold text-lg">Tourist Cluster</h3>
                    <p className="text-sm text-gray-600 mb-2">
                      {location.count} tourist{location.count > 1 ? 's' : ''}
                    </p>
                    <p className="text-sm mb-2">
                      Average Safety Score: <span className="font-semibold">{location.averageScore}</span>
                    </p>
                    <div className="space-y-1">
                      {location.tourists.slice(0, 3).map((tourist: Tourist) => (
                        <div key={tourist.id} className="text-xs">
                          <span className="font-medium">{tourist.name}</span> - 
                          <span className={`ml-1 ${
                            tourist.status === 'safe' ? 'text-green-600' :
                            tourist.status === 'warning' ? 'text-yellow-600' :
                            tourist.status === 'danger' ? 'text-red-600' : 'text-gray-600'
                          }`}>
                            {tourist.status}
                          </span>
                        </div>
                      ))}
                      {location.tourists.length > 3 && (
                        <p className="text-xs text-gray-500">
                          +{location.tourists.length - 3} more...
                        </p>
                      )}
                    </div>
                  </div>
                </Popup>
              </CircleMarker>
            ))}
          </MapContainer>
        </div>
        
        <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center">
            <p className="text-sm text-gray-600">Total Locations</p>
            <p className="text-2xl font-bold text-gray-900">{Object.keys(locationDensity).length}</p>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-600">Average Safety Score</p>
            <p className="text-2xl font-bold text-gray-900">
              {Math.round(
                Object.values(locationDensity).reduce((sum: number, loc: any) => sum + loc.averageScore, 0) / 
                Object.keys(locationDensity).length
              )}
            </p>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-600">Safety Zones</p>
            <p className="text-2xl font-bold text-gray-900">{safetyZones.length}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
