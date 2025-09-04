# SafeTrails

A comprehensive web-based dashboard for managing tourist safety and security, designed for the Ministry of Tourism and Police Department.

## Features

### 🏛️ Department Management
- **Ministry of Tourism Dashboard**: Tourist management and safety monitoring
- **Police Department Dashboard**: Law enforcement and emergency response
- Real-time statistics and performance metrics

### 👥 Tourist Management
- Complete tourist list with filtering and sorting
- Real-time safety score calculation
- Location tracking and history
- Emergency contact management
- Status monitoring (Safe, Warning, Danger, Missing)

### 🚨 Alert System
- Panic button alerts
- Geofencing notifications
- Anomaly detection alerts
- Missing person reports
- Severity-based alert prioritization

### 🗺️ Interactive Heatmap
- Real-time tourist location visualization
- Safety zone mapping (Safe, Warning, Restricted)
- Tourist density analysis
- Risk assessment by area

### 📊 Analytics & Reporting
- Safety score trends and analytics
- Area-based safety statistics
- Tourist status distribution
- Performance metrics and KPIs

## Technology Stack

- **Frontend**: React 18 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Charts**: Recharts
- **Maps**: React Leaflet + Leaflet
- **Icons**: Lucide React
- **State Management**: React Hooks

## Project Structure

```
src/
├── components/
│   ├── ui/                 # Reusable UI components
│   │   ├── Card.tsx
│   │   ├── Badge.tsx
│   │   └── Button.tsx
│   ├── dashboard/          # Dashboard-specific components
│   │   ├── Overview.tsx
│   │   ├── TouristList.tsx
│   │   ├── AlertsPanel.tsx
│   │   ├── Heatmap.tsx
│   │   ├── SafetyScoreChart.tsx
│   │   ├── StatsCard.tsx
│   │   └── DepartmentCard.tsx
│   └── layout/             # Layout components
│       ├── Header.tsx
│       └── Sidebar.tsx
├── data/                   # Mock data and constants
│   └── mockData.ts
├── types/                  # TypeScript type definitions
│   └── index.ts
├── utils/                  # Utility functions
│   └── index.ts
├── App.tsx                 # Main application component
├── main.tsx               # Application entry point
└── index.css              # Global styles
```

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd tourist-safety-dashboard
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:3000`

### Build for Production

```bash
npm run build
```

## Features Overview

### Dashboard Overview
- Real-time statistics cards
- Department-specific dashboards
- Quick access to key metrics
- Recent activity feed

### Tourist Management
- Comprehensive tourist list with search and filtering
- Safety score calculation based on location history
- Real-time status updates
- Emergency contact information

### Alert Management
- Multi-level alert system (Low, Medium, High, Critical)
- Alert categorization (Panic, Geofence, Anomaly, Missing)
- Assignment and tracking system
- Status management (Active, Investigating, Resolved)

### Interactive Heatmap
- Real-time tourist location visualization
- Safety zone overlays
- Tourist density clustering
- Risk assessment visualization

### Analytics Dashboard
- Safety score trends over time
- Area-based performance metrics
- Tourist status distribution
- Comparative analysis tools

## Data Structure

The application uses comprehensive TypeScript interfaces for:

- **Tourist**: Complete tourist profile with location, contacts, and safety data
- **Alert**: Alert system with severity, type, and status tracking
- **SafetyZone**: Geographic zones with risk levels and descriptions
- **DashboardStats**: Real-time statistics and KPIs

## Customization

### Adding New Components
1. Create component in appropriate folder (`ui/`, `dashboard/`, `layout/`)
2. Export from component file
3. Import and use in parent components

### Styling
- Uses Tailwind CSS for consistent styling
- Custom color palette defined in `tailwind.config.js`
- Utility classes in `src/index.css`

### Data Integration
- Replace mock data in `src/data/mockData.ts` with real API calls
- Update TypeScript interfaces in `src/types/index.ts` as needed
- Implement data fetching logic in components

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support and questions, please contact the development team.
