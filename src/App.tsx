import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { Header } from './components/layout/Header';
import { Sidebar } from './components/layout/Sidebar';
import { HomePage } from './pages/HomePage';
import { TourismDepartmentPage } from './pages/TourismDepartmentPage';
import { PoliceDepartmentPage } from './pages/PoliceDepartmentPage';
import { TouristDetailsPage } from './pages/TouristDetailsPage';
import { AlertDetailsPage } from './pages/AlertDetailsPage';
import { ActiveTripsPage } from './pages/ActiveTripsPage';
import { TripDetailsPage } from './pages/TripDetailsPage';
import { TouristList } from './components/dashboard/TouristList';
import { AlertsPanel } from './components/dashboard/AlertsPanel';
import { Heatmap } from './components/dashboard/Heatmap';
import { SafetyScoreChart } from './components/dashboard/SafetyScoreChart';
import apiService, { Trip, SosRequest, CommunityPost, User } from './services/api';
import { adaptTripToTourist, adaptUserToTourist, adaptSosToAlert, adaptCommunityPostToAlert } from './utils/dataAdapters';

// Dashboard Layout Component with API Integration
const DashboardLayout = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [trips, setTrips] = useState<Trip[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [sosRequests, setSosRequests] = useState<SosRequest[]>([]);
  const [communityPosts, setCommunityPosts] = useState<CommunityPost[]>([]);
  const [isDataLoading, setIsDataLoading] = useState(true);
  
  // Function to refresh alert data after acknowledgment
  const refreshAlerts = async () => {
    try {
      console.log('🔄 Refreshing alerts data...');
      
      const [sosResponse, communityResponse] = await Promise.all([
        apiService.getAllSosRequests({ limit: 1000 }),
        apiService.getAllCommunityReports({ limit: 1000 })
      ]);
      
      setSosRequests(sosResponse.sosRequests);
      setCommunityPosts(communityResponse.reports);
      
      console.log('✅ Alerts refreshed successfully');
    } catch (error) {
      console.error('❌ Failed to refresh alerts:', error);
    }
  };

  // Load data from APIs
  useEffect(() => {
    const loadData = async () => {
      if (!isAuthenticated) return;
      
      setIsDataLoading(true);
      
      try {
        console.log('🚀 Loading dashboard data...');
        
        // Load all trips from all locations
        console.log('🗺️ Fetching all trips...');
        const tripsResponse = await apiService.getAllTrips({ limit: 1000 });
        setTrips(tripsResponse.trips);
        console.log(`✅ Loaded ${tripsResponse.trips.length} trips`);
        
        // Load all users
        console.log('👥 Fetching all users...');
        const usersResponse = await apiService.getAllUsers();
        setUsers(usersResponse.users);
        console.log(`✅ Loaded ${usersResponse.users.length} users`);
        
        // Load SOS requests from admin API
        console.log('🆘 Fetching SOS requests...');
        const sosResponse = await apiService.getAllSosRequests({ limit: 1000 });
        setSosRequests(sosResponse.sosRequests);
        console.log(`✅ Loaded ${sosResponse.sosRequests.length} SOS requests`);
        
        // Load community posts from admin API
        console.log('📱 Fetching community reports...');
        const communityResponse = await apiService.getAllCommunityReports({ limit: 1000 });
        setCommunityPosts(communityResponse.reports);
        console.log(`✅ Loaded ${communityResponse.reports.length} community reports`);
        
        console.log('🎉 Dashboard data loaded successfully!');
      } catch (error) {
        console.error('❌ Failed to load data:', error);
      } finally {
        setIsDataLoading(false);
      }
    };

    loadData();
  }, [isAuthenticated]);

  // Convert API data to frontend models
  const touristsFromTrips = trips.map(adaptTripToTourist);
  const touristsFromUsers = users.map(adaptUserToTourist);
  
  // Combine and deduplicate tourists (prefer trip data over user data)
  const touristMap = new Map();
  
  // First add users (base data)
  touristsFromUsers.forEach(tourist => {
    touristMap.set(tourist.id, tourist);
  });
  
  // Then override with trip data (more complete)
  touristsFromTrips.forEach(tourist => {
    touristMap.set(tourist.id, tourist);
  });
  
  const tourists = Array.from(touristMap.values());
  
  // Debug logging
  console.log('📊 Dashboard Data Summary:', {
    users: users.length,
    trips: trips.length,
    tourists: tourists.length,
    sosRequests: sosRequests.length,
    communityPosts: communityPosts.length
  });
  
  const alerts = [
    ...sosRequests.map(adaptSosToAlert),
    ...communityPosts.map(adaptCommunityPostToAlert)
  ];

  if (isLoading || isDataLoading) {
    return (
      <div className="flex min-h-screen bg-gray-100 items-center justify-center p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="flex h-screen bg-gray-100 relative">
      <Sidebar 
        activeTab={activeTab} 
        onTabChange={setActiveTab}
        isMobileMenuOpen={isMobileMenuOpen}
        onMobileMenuClose={() => setIsMobileMenuOpen(false)}
      />
      <div className="flex-1 flex flex-col overflow-hidden w-full lg:w-auto">
        <Header 
          activeAlerts={alerts.filter(alert => alert.status === 'active').length}
          onMobileMenuToggle={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-4 sm:p-6">
          <Routes>
            <Route index element={<HomePage />} />
            <Route path="tourists" element={
              <TouristList
                tourists={tourists}
                onTouristSelect={() => {}}
              />
            } />
            <Route path="trips" element={
              <ActiveTripsPage
                trips={trips}
                sosRequests={sosRequests}
                communityPosts={communityPosts}
              />
            } />
            <Route path="alerts" element={
              <AlertsPanel
                alerts={alerts}
                onAlertSelect={() => {}}
                onAlertUpdate={refreshAlerts}
              />
            } />
            <Route path="heatmap" element={
              <Heatmap
                // No props passed - component uses mock data only
              />
            } />
            <Route path="analytics" element={
              <SafetyScoreChart
                // No props passed - component uses mock data only
              />
            } />
            <Route path="department/tourism" element={<TourismDepartmentPage />} />
            <Route path="department/police" element={<PoliceDepartmentPage />} />
            <Route path="tourist/:id" element={<TouristDetailsPage />} />
            <Route path="trip/:tripId" element={
              <TripDetailsPage
                trips={trips}
                sosRequests={sosRequests}
                communityPosts={communityPosts}
              />
            } />
            <Route path="alert/:id" element={<AlertDetailsPage />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

// Protected Route Component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isLoading } = useAuth();
  
  if (isLoading) {
    return (
      <div className="flex min-h-screen bg-gray-100 items-center justify-center p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }
  
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/dashboard/*" element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          } />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
