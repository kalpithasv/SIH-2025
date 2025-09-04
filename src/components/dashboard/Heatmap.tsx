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

  // Create heatmap data points with intensity based on risk
  const heatmapData = tourists.map(tourist => {
    let intensity = 0.1; // Base intensity
    
    // Increase intensity based on risk level
    switch (tourist.status) {
      case 'missing':
        intensity = 1.0; // Maximum intensity for missing tourists
        break;
      case 'danger':
        intensity = 0.8; // High intensity for danger
        break;
      case 'warning':
        intensity = 0.5; // Medium intensity for warning
        break;
      case 'safe':
        intensity = 0.2; // Low intensity for safe
        break;
    }
    
    // Adjust intensity based on safety score (lower score = higher intensity)
    const scoreIntensity = (100 - tourist.safetyScore) / 100;
    intensity = Math.max(intensity, scoreIntensity);
    
    return [
      tourist.currentLocation.lat,
      tourist.currentLocation.lng,
      intensity
    ];
  });

  // Create regional density data for broader heatmap visualization
  const regionalData = tourists.reduce((acc, tourist) => {
    // Group by broader regions (rounded coordinates)
    const regionKey = `${Math.round(tourist.currentLocation.lat * 2) / 2},${Math.round(tourist.currentLocation.lng * 2) / 2}`;
    
    if (!acc[regionKey]) {
      acc[regionKey] = {
        lat: Math.round(tourist.currentLocation.lat * 2) / 2,
        lng: Math.round(tourist.currentLocation.lng * 2) / 2,
        count: 0,
        totalIntensity: 0,
        riskLevel: 'low',
        dangerCount: 0,
        warningCount: 0,
        safeCount: 0
      };
    }
    
    acc[regionKey].count += 1;
    
    // Calculate intensity based on tourist status
    let intensity = 0.1;
    switch (tourist.status) {
      case 'missing':
        intensity = 1.0;
        acc[regionKey].dangerCount += 1;
        break;
      case 'danger':
        intensity = 0.8;
        acc[regionKey].dangerCount += 1;
        break;
      case 'warning':
        intensity = 0.5;
        acc[regionKey].warningCount += 1;
        break;
      case 'safe':
        intensity = 0.2;
        acc[regionKey].safeCount += 1;
        break;
    }
    
    acc[regionKey].totalIntensity += intensity;
    
    return acc;
  }, {} as Record<string, any>);

  // Calculate average intensity and risk level for each region
  Object.values(regionalData).forEach((region: any) => {
    region.averageIntensity = region.totalIntensity / region.count;
    
    // Determine risk level
    if (region.dangerCount > 0 || region.averageIntensity > 0.7) {
      region.riskLevel = 'high';
    } else if (region.warningCount > 0 || region.averageIntensity > 0.4) {
      region.riskLevel = 'medium';
    } else {
      region.riskLevel = 'low';
    }
  });

  const getMarkerColor = (score: number, riskLevel: string = 'low') => {
    // Prioritize risk level over safety score for red coloring
    if (riskLevel === 'high' || score < 30) return '#dc2626'; // Dark Red - High Risk
    if (riskLevel === 'medium' || score < 50) return '#ef4444'; // Red - Medium Risk
    if (score < 70) return '#f97316'; // Orange - Low-Medium Risk
    if (score < 85) return '#f59e0b'; // Yellow - Good
    return '#22c55e'; // Green - Safe
  };

  const getZoneColor = (type: string) => {
    switch (type) {
      case 'safe': return '#22c55e';
      case 'warning': return '#f59e0b';
      case 'restricted': return '#dc2626'; // Darker red for restricted zones
      default: return '#6b7280';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Tourist Risk Heatmap & Density Analysis</CardTitle>
        <div className="flex flex-wrap gap-2 mt-2">
          <Badge variant="info">🔵 Low Risk</Badge>
          <Badge variant="success">🟢 Safe</Badge>
          <Badge variant="warning">🟡 Warning</Badge>
          <Badge variant="warning">🟠 High Risk</Badge>
          <Badge variant="danger">🔴 Critical Risk</Badge>
        </div>
        <div className="flex flex-wrap gap-2 mt-2">
          <Badge variant="success">🟢 Safe Zone</Badge>
          <Badge variant="warning">🟡 Warning Zone</Badge>
          <Badge variant="danger">🔴 Restricted Zone</Badge>
        </div>
        <p className="text-sm text-gray-600 mt-2">
          Heat intensity shows tourist risk concentration - Red areas indicate high-risk zones requiring immediate attention
        </p>
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
            
            {/* Heatmap Visualization using overlapping circles */}
            {heatmapData.map((point: any, index: number) => {
              const [lat, lng, intensity] = point;
              const radius = 20 + (intensity * 30); // Radius based on intensity
              const opacity = 0.1 + (intensity * 0.4); // Opacity based on intensity
              
              // Color based on intensity
              let color = '#3b82f6'; // Blue for low intensity
              if (intensity > 0.8) color = '#dc2626'; // Red for high intensity
              else if (intensity > 0.6) color = '#ea580c'; // Orange
              else if (intensity > 0.4) color = '#eab308'; // Yellow
              else if (intensity > 0.2) color = '#22c55e'; // Green
              
              return (
                <CircleMarker
                  key={`heat-${index}`}
                  center={[lat, lng]}
                  radius={radius}
                  pathOptions={{
                    color: color,
                    fillColor: color,
                    fillOpacity: opacity,
                    weight: 0
                  }}
                />
              );
            })}
            
            {/* Safety Zones */}
            {safetyZones.map((zone) => (
              <Polygon
                key={zone.id}
                positions={zone.coordinates}
                pathOptions={{
                  color: getZoneColor(zone.type),
                  fillColor: getZoneColor(zone.type),
                  fillOpacity: zone.type === 'restricted' ? 0.4 : 0.3,
                  weight: zone.type === 'restricted' ? 3 : 2
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
            
            {/* Regional Density Markers */}
            {Object.values(regionalData).map((region: any, index) => (
              <CircleMarker
                key={index}
                center={[region.lat, region.lng]}
                radius={Math.max(8, Math.min(20, region.count * 2 + (region.riskLevel === 'high' ? 8 : 0)))}
                pathOptions={{
                  color: getMarkerColor(0, region.riskLevel),
                  fillColor: getMarkerColor(0, region.riskLevel),
                  fillOpacity: region.riskLevel === 'high' ? 0.8 : 0.6,
                  weight: region.riskLevel === 'high' ? 3 : 2
                }}
              >
                <Popup>
                  <div className="p-3">
                    <h3 className="font-semibold text-lg mb-2">Regional Risk Area</h3>
                    <div className="mb-3">
                      <p className="text-sm text-gray-600 mb-1">
                        {region.count} tourist{region.count > 1 ? 's' : ''} in region
                      </p>
                      <div className="flex items-center space-x-2 mb-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          region.riskLevel === 'high' ? 'bg-red-100 text-red-800' :
                          region.riskLevel === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-green-100 text-green-800'
                        }`}>
                          {region.riskLevel.toUpperCase()} RISK
                        </span>
                      </div>
                      <p className="text-sm mb-2">
                        Intensity: <span className="font-semibold">{(region.averageIntensity * 100).toFixed(1)}%</span>
                      </p>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="text-xs">
                        <span className="font-medium text-red-600">🔴 Danger: {region.dangerCount}</span>
                        <span className="ml-2 font-medium text-yellow-600">🟡 Warning: {region.warningCount}</span>
                        <span className="ml-2 font-medium text-green-600">🟢 Safe: {region.safeCount}</span>
                      </div>
                    </div>
                  </div>
                </Popup>
              </CircleMarker>
            ))}
          </MapContainer>
        </div>
        
        <div className="mt-4 grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="text-center">
            <p className="text-sm text-gray-600">Total Regions</p>
            <p className="text-2xl font-bold text-gray-900">{Object.keys(regionalData).length}</p>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-600">High Risk Areas</p>
            <p className="text-2xl font-bold text-red-600">
              {Object.values(regionalData).filter((region: any) => region.riskLevel === 'high').length}
            </p>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-600">Average Intensity</p>
            <p className="text-2xl font-bold text-gray-900">
              {Math.round(
                Object.values(regionalData).reduce((sum: number, region: any) => sum + region.averageIntensity, 0) / 
                Object.keys(regionalData).length * 100
              )}%
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
