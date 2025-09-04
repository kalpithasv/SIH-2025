import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Header } from './components/layout/Header';
import { Sidebar } from './components/layout/Sidebar';
import { HomePage } from './pages/HomePage';
import { TourismDepartmentPage } from './pages/TourismDepartmentPage';
import { PoliceDepartmentPage } from './pages/PoliceDepartmentPage';
import { TouristDetailsPage } from './pages/TouristDetailsPage';
import { AlertDetailsPage } from './pages/AlertDetailsPage';
import { TouristList } from './components/dashboard/TouristList';
import { AlertsPanel } from './components/dashboard/AlertsPanel';
import { Heatmap } from './components/dashboard/Heatmap';
import { SafetyScoreChart } from './components/dashboard/SafetyScoreChart';
import { mockTourists, mockAlerts, mockSafetyZones } from './data/mockData';

function App() {
  const [activeTab, setActiveTab] = useState('overview');

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return <HomePage />;
      case 'tourists':
        return (
          <TouristList
            tourists={mockTourists}
            onTouristSelect={() => {}}
          />
        );
      case 'alerts':
        return (
          <AlertsPanel
            alerts={mockAlerts}
            onAlertSelect={() => {}}
          />
        );
      case 'heatmap':
        return (
          <Heatmap
            tourists={mockTourists}
            safetyZones={mockSafetyZones}
          />
        );
      case 'analytics':
        return (
          <SafetyScoreChart
            tourists={mockTourists}
          />
        );
      case 'reports':
        return (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Reports</h2>
            <p className="text-gray-600">Reports functionality coming soon...</p>
          </div>
        );
      case 'settings':
        return (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Settings</h2>
            <p className="text-gray-600">Settings functionality coming soon...</p>
          </div>
        );
      default:
        return <HomePage />;
    }
  };

  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <Header activeAlerts={mockAlerts.filter(alert => alert.status === 'active').length} />
        
        <div className="flex h-[calc(100vh-80px)]">
          <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
          
          <main className="flex-1 overflow-auto">
            <div className="p-6">
              <Routes>
                <Route path="/" element={renderContent()} />
                <Route path="/department/tourism" element={<TourismDepartmentPage />} />
                <Route path="/department/police" element={<PoliceDepartmentPage />} />
                <Route path="/tourist/:id" element={<TouristDetailsPage />} />
                <Route path="/alert/:id" element={<AlertDetailsPage />} />
              </Routes>
            </div>
          </main>
        </div>
      </div>
    </Router>
  );
}

export default App;
