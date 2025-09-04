import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { Tourist } from '../../types';

interface SafetyScoreChartProps {
  tourists: Tourist[];
}

export const SafetyScoreChart: React.FC<SafetyScoreChartProps> = ({ tourists }) => {
  // Calculate average safety score by area
  const areaStats = tourists.reduce((acc, tourist) => {
    const area = tourist.currentLocation.address.split(',')[0]; // Get city/area name
    if (!acc[area]) {
      acc[area] = { total: 0, count: 0, tourists: [] };
    }
    acc[area].total += tourist.safetyScore;
    acc[area].count += 1;
    acc[area].tourists.push(tourist);
    return acc;
  }, {} as Record<string, { total: number; count: number; tourists: Tourist[] }>);

  const chartData = Object.entries(areaStats).map(([area, stats]) => ({
    area,
    averageScore: Math.round(stats.total / stats.count),
    touristCount: stats.count,
    safeCount: stats.tourists.filter(t => t.status === 'safe').length,
    warningCount: stats.tourists.filter(t => t.status === 'warning').length,
    dangerCount: stats.tourists.filter(t => t.status === 'danger').length,
    missingCount: stats.tourists.filter(t => t.status === 'missing').length
  }));

  // Time-based safety score data (simulated)
  const timeData = [
    { time: '00:00', score: 75 },
    { time: '04:00', score: 72 },
    { time: '08:00', score: 78 },
    { time: '12:00', score: 82 },
    { time: '16:00', score: 85 },
    { time: '20:00', score: 80 },
    { time: '24:00', score: 75 }
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Safety Score by Area</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="area" />
              <YAxis domain={[0, 100]} />
              <Tooltip 
                formatter={(value: any, name: string) => [
                  `${value}%`, 
                  name === 'averageScore' ? 'Average Safety Score' : name
                ]}
              />
              <Bar dataKey="averageScore" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Safety Score Trends (24h)</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={timeData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" />
              <YAxis domain={[0, 100]} />
              <Tooltip 
                formatter={(value: any) => [`${value}%`, 'Safety Score']}
              />
              <Line 
                type="monotone" 
                dataKey="score" 
                stroke="#3b82f6" 
                strokeWidth={2}
                dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>Tourist Status Distribution by Area</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="area" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="safeCount" stackId="a" fill="#22c55e" name="Safe" />
              <Bar dataKey="warningCount" stackId="a" fill="#f59e0b" name="Warning" />
              <Bar dataKey="dangerCount" stackId="a" fill="#ef4444" name="Danger" />
              <Bar dataKey="missingCount" stackId="a" fill="#6b7280" name="Missing" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};
