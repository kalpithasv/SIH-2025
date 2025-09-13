# SafeTrails Dashboard - API Integration Analysis

## Project Overview

The SafeTrails Dashboard is a React-based web application built with **Vite + TypeScript** that provides comprehensive tourist safety monitoring for government authorities. It includes separate views for Tourism Department and Police Department, with real-time data visualization and management capabilities.

## Tech Stack

- **Frontend Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS with custom components
- **Routing**: React Router DOM
- **Charts**: Recharts library
- **Maps**: React Leaflet with Leaflet.js
- **Icons**: Lucide React

## Project Structure

```
src/
├── components/
│   ├── ui/                     # Reusable UI components (Badge, Button, Card)
│   ├── dashboard/              # Dashboard-specific components
│   └── layout/                 # Layout components (Header, Sidebar)
├── pages/                      # Page components
├── types/                      # TypeScript type definitions
├── data/                       # Mock data (TO BE REPLACED)
└── utils/                      # Utility functions
```

## Components Analysis

### 1. Core Dashboard Components

#### **TouristList.tsx**
- **Purpose**: Displays list of tourists with filtering and sorting capabilities
- **Features**: 
  - Filter by status (all, safe, warning, danger, missing)
  - Sort by name, safety score, last seen
  - Navigation to individual tourist details
- **Mock Data Used**: `mockTourists` array

#### **AlertsPanel.tsx**
- **Purpose**: Displays security alerts and incidents
- **Features**:
  - Filter by status (active, investigating, resolved)
  - Filter by severity (low, medium, high, critical)
  - Navigation to alert details
- **Mock Data Used**: `mockAlerts` array

#### **Overview.tsx**
- **Purpose**: Main dashboard overview with statistics
- **Features**: 
  - Statistics cards showing totals and trends
  - Department-specific navigation
  - Recent activity feed
- **Mock Data Used**: `mockDashboardStats` object

#### **StatsCard.tsx** & **DepartmentCard.tsx**
- **Purpose**: Reusable components for displaying statistics
- **Data Source**: Receive props from parent components (no direct mock data usage)

### 2. Analytics Components (KEEP AS IS - No API Needed)

#### **Heatmap.tsx**
- **Purpose**: Interactive map visualization with risk analysis
- **Features**: Tourist location plotting, safety zones, risk density
- **Note**: As requested, this analytical component should remain with mock data

#### **SafetyScoreChart.tsx**
- **Purpose**: Charts showing safety trends and area analysis
- **Features**: Bar charts, line charts, safety score distribution
- **Note**: As requested, this analytical component should remain with mock data

### 3. Detail Pages

#### **TouristDetailsPage.tsx**
- **Purpose**: Individual tourist detailed view
- **Features**: Personal info, location history, emergency contacts, safety status
- **Mock Data Used**: Finds tourist by ID from `mockTourists`

#### **AlertDetailsPage.tsx**
- **Purpose**: Individual alert detailed view
- **Features**: Alert information, timeline, quick actions, emergency contacts
- **Mock Data Used**: Finds alert by ID from `mockAlerts`

### 4. Department Pages

#### **TourismDepartmentPage.tsx**
- **Purpose**: Tourism ministry dashboard
- **Features**: Tourism-specific statistics, tourist list, analytics
- **Mock Data Used**: `mockTourists`, `mockSafetyZones`

#### **PoliceDepartmentPage.tsx**
- **Purpose**: Police department dashboard
- **Features**: Alert management, response statistics, officer assignments
- **Mock Data Used**: `mockTourists`, `mockAlerts`, `mockSafetyZones`

## Required API Endpoints

Based on the analysis, the following APIs need to be implemented to replace mock data:

### 1. **Tourist Management APIs**

#### GET `/api/admin/dashboard/users` or `/api/admin/dashboard/tourists`
**Purpose**: Get list of all tourists with filtering and pagination
**Query Parameters**:
- `status`: 'safe' | 'warning' | 'danger' | 'missing' | 'all'
- `sortBy`: 'name' | 'safetyScore' | 'lastSeen'
- `sortOrder`: 'asc' | 'desc'
- `limit`: number
- `offset`: number

**Response Structure**:
```typescript
{
  tourists: Tourist[],
  total: number,
  stats: {
    totalTourists: number,
    safeTourists: number,
    warningTourists: number,
    dangerTourists: number,
    missingTourists: number,
    averageSafetyScore: number
  }
}
```

#### GET `/api/admin/dashboard/tourists/:id`
**Purpose**: Get detailed information for a specific tourist
**Response**: Complete `Tourist` object with travel history and emergency contacts

### 2. **Alert Management APIs**

#### GET `/api/admin/dashboard/alerts` or `/api/admin/sos-requests`
**Purpose**: Get list of alerts with filtering
**Query Parameters**:
- `status`: 'active' | 'investigating' | 'resolved' | 'all'
- `severity`: 'low' | 'medium' | 'high' | 'critical' | 'all'
- `limit`: number
- `offset`: number

**Response Structure**:
```typescript
{
  alerts: Alert[],
  total: number,
  stats: {
    activeAlerts: number,
    investigatingAlerts: number,
    resolvedAlerts: number,
    totalAlerts: number
  }
}
```

#### GET `/api/admin/dashboard/alerts/:id`
**Purpose**: Get detailed information for a specific alert
**Response**: Complete `Alert` object with full details

### 3. **Dashboard Statistics API**

#### GET `/api/admin/dashboard/overview`
**Purpose**: Get comprehensive dashboard statistics
**Response Structure**:
```typescript
{
  overview: {
    totalUsers: number,           // totalTourists
    activeTrips: number,          // for context
    pendingKyc: number,          // additional info
    activeSos: number,           // activeAlerts
    recentCommunityReports: number,
    todayStats: number
  },
  stats: {
    totalTourists: number,
    safeTourists: number,
    warningTourists: number,
    dangerTourists: number,
    missingTourists: number,
    averageSafetyScore: number,
    activeAlerts: number,
    resolvedAlerts: number
  },
  recentActivity: ActivityItem[] // for recent activity feed
}
```

### 4. **Department-Specific APIs**

#### GET `/api/admin/dashboard/tourism/stats`
**Purpose**: Get tourism department specific statistics
**Response**: Tourism-focused metrics and tourist counts

#### GET `/api/admin/dashboard/police/stats`
**Purpose**: Get police department specific statistics
**Response**: Alert-focused metrics, response times, officer assignments

## Data Type Mappings

### Dashboard Tourist Type vs SafeTrails API User Type

**Dashboard Tourist Interface:**
```typescript
interface Tourist {
  id: string;
  name: string;
  nationality: string;
  passportNumber: string;
  phoneNumber: string;
  email: string;
  arrivalDate: string;
  departureDate: string;
  currentLocation: {
    lat: number;
    lng: number;
    address: string;
  };
  safetyScore: number;
  status: 'safe' | 'warning' | 'danger' | 'missing';
  lastSeen: string;
  travelHistory: LocationHistory[];
  emergencyContacts: EmergencyContact[];
  isTrackingEnabled: boolean;
}
```

**SafeTrails API User Type Mapping:**
- `id` → `user.id`
- `name` → `user.firstName + user.lastName`
- `nationality` → From user profile or KYC data
- `passportNumber` → From KYC data
- `phoneNumber` → `user.phone`
- `email` → `user.email`
- `arrivalDate`/`departureDate` → From active trip data
- `currentLocation` → `user.currentLatitude/currentLongitude` + reverse geocoding
- `safetyScore` → `user.safetyScore`
- `status` → Calculated based on safety score, alerts, trip status
- `lastSeen` → `user.lastLocationUpdate`
- `isTrackingEnabled` → From user preferences or trip settings

### Dashboard Alert Type vs SafeTrails SOS Type

**Dashboard Alert Interface:**
```typescript
interface Alert {
  id: string;
  touristId: string;
  touristName: string;
  type: 'panic' | 'geofence' | 'anomaly' | 'missing';
  severity: 'low' | 'medium' | 'high' | 'critical';
  message: string;
  timestamp: string;
  location: { lat: number; lng: number; address: string; };
  status: 'active' | 'investigating' | 'resolved';
  assignedTo?: string;
}
```

**SafeTrails SOS/Alert Mapping:**
- `id` → `sosRequest.id`
- `touristId` → `sosRequest.userId`
- `touristName` → Join with user data
- `type` → Map from `sosRequest.sosType`
- `severity` → Calculated based on SOS type and context
- `message` → `sosRequest.description` or auto-generated
- `timestamp` → `sosRequest.createdAt`
- `location` → `sosRequest.latitude/longitude` + address
- `status` → `sosRequest.status`
- `assignedTo` → `sosRequest.resolvedBy` or admin assignment

## Implementation Priority

### Phase 1: Core Data APIs
1. **Tourist List API** - Most critical for main dashboard functionality
2. **Alert List API** - Essential for police department view
3. **Dashboard Overview API** - Required for homepage statistics

### Phase 2: Detail Pages
4. **Individual Tourist Details API**
5. **Individual Alert Details API**

### Phase 3: Department Specific
6. **Department-specific statistics APIs**
7. **Additional filtering and sorting endpoints**

## Integration Notes

1. **Authentication**: All APIs should use the existing JWT authentication from SafeTrails
2. **Error Handling**: Implement proper error states in React components
3. **Loading States**: Add loading indicators for API calls
4. **Real-time Updates**: Consider WebSocket integration for real-time alert updates
5. **Caching**: Implement proper data caching strategy for better performance

## Components That DO NOT Need APIs

As requested, the following analytical/map components should **remain using mock data**:
- `Heatmap.tsx` - Keep mock `mockSafetyZones` for zone visualization
- `SafetyScoreChart.tsx` - Keep analytical chart data as mock (timeData, trend analysis)

All other components displaying **user details** and **alert details** should be connected to real APIs.