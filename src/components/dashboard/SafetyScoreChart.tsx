import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell, Legend } from 'recharts';
import { Tourist } from '../../types';
import { mockAnalyticsData } from '../../data/mockData';

interface SafetyScoreChartProps {
  tourists?: Tourist[]; // Made optional since we're using mock data
}

export const SafetyScoreChart: React.FC<SafetyScoreChartProps> = () => {
  console.log('📊 SafetyScoreChart: Using MOCK DATA only (as requested)');
  
  // Use mock analytics data instead of API tourist data
  const chartData = mockAnalyticsData.areaStats;
  const timeData = mockAnalyticsData.hourlyTrends;
  const weeklyData = mockAnalyticsData.weeklyTrends;
  const riskDistribution = mockAnalyticsData.riskDistribution;

  return (
    <div className="space-y-6">
      {/* Header with Analytics Info */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
          <h2 className="text-lg font-semibold text-blue-900">Analytics Dashboard - Mock Data</h2>
        </div>
        <p className="text-sm text-blue-700 mt-1">
          This section uses comprehensive mock analytics data for demonstration purposes. 
          Charts show simulated safety trends, area statistics, and risk analysis.
        </p>
      </div>

      {/* Main Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Safety Score by Area</CardTitle>
            <p className="text-sm text-gray-600">Average safety scores across major tourist destinations</p>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="area" angle={-45} textAnchor="end" height={80} fontSize={12} />
                <YAxis domain={[0, 100]} />
                <Tooltip 
                  formatter={(value: any, name: string) => {
                    if (name === 'averageScore') return [`${value}%`, 'Average Safety Score'];
                    return [value, name];
                  }}
                  labelFormatter={(label) => `Area: ${label}`}
                />
                <Bar dataKey="averageScore" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>24-Hour Safety Trends</CardTitle>
            <p className="text-sm text-gray-600">Real-time safety score variations throughout the day</p>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={timeData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis domain={[60, 90]} />
                <Tooltip 
                  formatter={(value: any, name: string) => {
                    if (name === 'score') return [`${value}%`, 'Safety Score'];
                    if (name === 'activeUsers') return [value, 'Active Users'];
                    if (name === 'alerts') return [value, 'Active Alerts'];
                    return [value, name];
                  }}
                  labelFormatter={(label) => `Time: ${label}`}
                />
                <Line 
                  type="monotone" 
                  dataKey="score" 
                  stroke="#3b82f6" 
                  strokeWidth={3}
                  dot={{ fill: '#3b82f6', strokeWidth: 2, r: 5 }}
                  activeDot={{ r: 8 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="activeUsers" 
                  stroke="#22c55e" 
                  strokeWidth={2}
                  dot={{ fill: '#22c55e', strokeWidth: 2, r: 3 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Weekly Safety Trends</CardTitle>
            <p className="text-sm text-gray-600">Safety performance and incident patterns by day</p>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis yAxisId="score" orientation="left" domain={[60, 85]} />
                <YAxis yAxisId="incidents" orientation="right" />
                <Tooltip 
                  formatter={(value: any, name: string) => {
                    if (name === 'score') return [`${value}%`, 'Safety Score'];
                    if (name === 'incidents') return [value, 'Incidents'];
                    if (name === 'tourists') return [value, 'Tourist Count'];
                    return [value, name];
                  }}
                />
                <Bar yAxisId="score" dataKey="score" fill="#3b82f6" name="Safety Score" />
                <Bar yAxisId="incidents" dataKey="incidents" fill="#ef4444" name="Incidents" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Risk Distribution</CardTitle>
            <p className="text-sm text-gray-600">Overall tourist safety status breakdown</p>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={riskDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percentage }) => `${name}: ${percentage}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {riskDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: any) => [value, 'Count']} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Full Width Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Tourist Status Distribution by Area</CardTitle>
          <p className="text-sm text-gray-600">Detailed breakdown of tourist safety status across different regions</p>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="area" angle={-45} textAnchor="end" height={80} fontSize={12} />
              <YAxis />
              <Tooltip 
                formatter={(value: any, name: string) => [value, name]}
                labelFormatter={(label) => `Area: ${label}`}
              />
              <Legend />
              <Bar dataKey="safeCount" stackId="a" fill="#22c55e" name="Safe" />
              <Bar dataKey="warningCount" stackId="a" fill="#f59e0b" name="Warning" />
              <Bar dataKey="dangerCount" stackId="a" fill="#ef4444" name="Danger" />
              <Bar dataKey="missingCount" stackId="a" fill="#6b7280" name="Missing" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">12</div>
              <p className="text-sm text-gray-600">Active Locations</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">76.8%</div>
              <p className="text-sm text-gray-600">Avg Safety Score</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">48</div>
              <p className="text-sm text-gray-600">Active Alerts</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-600">297</div>
              <p className="text-sm text-gray-600">Total Tourists</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
