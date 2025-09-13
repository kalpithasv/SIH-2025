// API Service Layer for Backend Integration
// Using the correct production URL based on frontend API guide
const API_BASE_URL = 'https://safetrails.onrender.com';

// Types for API responses
export interface ApiResponse<T> {
  success?: boolean;
  message?: string;
  data?: T;
  user?: T;
  token?: string;
}

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
  currentLatitude?: number;
  currentLongitude?: number;
  lastLocationUpdate?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  message: string;
  user: User;
  token: string;
}

export interface AdminLoginResponse {
  message: string;
  admin: User;
  token: string;
}

export interface Trip {
  id: string;
  userId: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  startLocation: string;
  endLocation: string;
  startLatitude: number;
  startLongitude: number;
  endLatitude: number;
  endLongitude: number;
  status: 'PLANNED' | 'ACTIVE' | 'COMPLETED' | 'CANCELLED';
  safetyScore: number;
  actualStartTime?: string;
  actualEndTime?: string;
  createdAt: string;
  user: User;
  itineraryItems?: ItineraryItem[];
  locationUpdates?: LocationUpdate[];
  sosRequests?: SosRequest[];
  communityPosts?: CommunityPost[];
  _count?: {
    locationUpdates?: number;
    sosRequests?: number;
    communityPosts?: number;
  };
}

export interface ItineraryItem {
  id: string;
  location: string;
  landmark: string;
  latitude: number;
  longitude: number;
  plannedTime: string;
  order: number;
  isCompleted: boolean;
}

export interface LocationUpdate {
  id: string;
  userId: string;
  tripId: string;
  latitude: number;
  longitude: number;
  accuracy: number;
  speed: number;
  heading: number;
  altitude: number;
  timestamp: string;
}

export interface SosRequest {
  id: string;
  location: string;
  latitude: number;
  longitude: number;
  sosType: 'GENERAL' | 'MEDICAL' | 'SECURITY' | 'ACCIDENT' | 'NATURAL_DISASTER';
  status: 'NEW' | 'ACKNOWLEDGED' | 'IN_PROGRESS' | 'RESOLVED' | 'FALSE_ALARM';
  description: string;
  contactNumbers: EmergencyContact[];
  createdAt: string;
  updatedAt: string;
  user: User;
  trip?: Trip;
}

export interface EmergencyContact {
  name: string;
  phone: string;
  relation: string;
}

export interface CommunityPost {
  id: string;
  title: string;
  issueDescription: string;
  location: string;
  latitude: number;
  longitude: number;
  incidentType: 'ROAD_ACCIDENT' | 'THEFT' | 'HARASSMENT' | 'MEDICAL_EMERGENCY' | 'NATURAL_DISASTER' | 'FRAUD' | 'INFRASTRUCTURE' | 'OTHER';
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  status: 'OPEN' | 'UNDER_REVIEW' | 'RESOLVED' | 'CLOSED';
  likeCount: number;
  dislikeCount: number;
  imageUrl?: string;
  createdAt: string;
  user: User;
  trip?: Trip;
}

export interface AdminOverview {
  overview: {
    totalUsers: number;
    activeTrips: number;
    pendingKyc: number;
    activeSos: number;
    recentCommunityReports: number;
    todayStats: number;
  };
  recentActivity: {
    sosRequests: SosRequest[];
    communityReports: CommunityPost[];
  };
}

// API Service Class
class ApiService {
  private baseURL: string;
  private token: string | null = null;

  constructor(baseURL: string = API_BASE_URL) {
    this.baseURL = baseURL;
    this.token = localStorage.getItem('authToken');
  }

  // Set authentication token
  setToken(token: string) {
    this.token = token;
    localStorage.setItem('authToken', token);
  }

  // Clear authentication token
  clearToken() {
    this.token = null;
    localStorage.removeItem('authToken');
  }

  // Get headers for API requests
  private getHeaders(): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    return headers;
  }

  // Generic API request method
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    
    console.log('🚀 API Request:', {
      url,
      method: options.method || 'GET',
      headers: {
        ...this.getHeaders(),
        ...options.headers,
      },
      body: options.body
    });
    
    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          ...this.getHeaders(),
          ...options.headers,
        },
      });

      console.log('📡 API Response Status:', {
        url,
        status: response.status,
        statusText: response.statusText,
        ok: response.ok
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('❌ API Error:', {
          url,
          status: response.status,
          errorData
        });
        throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
      }

      const responseData = await response.json();
      console.log('✅ API Response Data:', {
        url,
        data: responseData
      });
      
      return responseData;
    } catch (error) {
      console.error('💥 API Request Failed:', {
        url,
        error: error instanceof Error ? error.message : error,
        stack: error instanceof Error ? error.stack : undefined
      });
      
      // Provide more specific error messages for common issues
      if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
        throw new Error('Network error: Unable to connect to server. Please check your internet connection and try again.');
      }
      
      if (error instanceof Error && error.name === 'AbortError') {
        throw new Error('Request timed out. Please try again.');
      }
      
      throw error;
    }
  }

  // Authentication APIs
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    const response = await this.request<LoginResponse>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });

    if (response.token) {
      this.setToken(response.token);
    }

    return response;
  }

  async register(userData: any): Promise<ApiResponse<User>> {
    return this.request<ApiResponse<User>>('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async getProfile(): Promise<{ user: User }> {
    return this.request<{ user: User }>('/api/auth/profile');
  }

  async updateProfile(profileData: Partial<User>): Promise<ApiResponse<User>> {
    return this.request<ApiResponse<User>>('/api/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(profileData),
    });
  }

  async changePassword(passwordData: { currentPassword: string; newPassword: string }): Promise<ApiResponse<any>> {
    return this.request<ApiResponse<any>>('/api/auth/change-password', {
      method: 'PUT',
      body: JSON.stringify(passwordData),
    });
  }

  async updateEmergencyContacts(contacts: EmergencyContact[]): Promise<ApiResponse<any>> {
    return this.request<ApiResponse<any>>('/api/auth/emergency-contacts', {
      method: 'PUT',
      body: JSON.stringify({ emergencyContacts: contacts }),
    });
  }

  // Trip Management APIs
  async createTrip(tripData: any): Promise<ApiResponse<Trip>> {
    return this.request<ApiResponse<Trip>>('/api/trips', {
      method: 'POST',
      body: JSON.stringify(tripData),
    });
  }

  async getTrips(params?: {
    status?: string;
    limit?: number;
    offset?: number;
  }): Promise<{ trips: Trip[] }> {
    const queryParams = new URLSearchParams();
    if (params?.status) queryParams.append('status', params.status);
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.offset) queryParams.append('offset', params.offset.toString());

    const endpoint = `/api/trips${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    return this.request<{ trips: Trip[] }>(endpoint);
  }

  async getTripDetails(tripId: string): Promise<{ trip: Trip }> {
    return this.request<{ trip: Trip }>(`/api/trips/${tripId}`);
  }

  async startTrip(tripId: string, location: { startLatitude: number; startLongitude: number }): Promise<ApiResponse<Trip>> {
    return this.request<ApiResponse<Trip>>(`/api/trips/${tripId}/start`, {
      method: 'POST',
      body: JSON.stringify(location),
    });
  }

  async updateLocation(tripId: string, locationData: {
    latitude: number;
    longitude: number;
    accuracy: number;
    speed: number;
    heading: number;
    altitude: number;
  }): Promise<ApiResponse<any>> {
    return this.request<ApiResponse<any>>(`/api/trips/${tripId}/update-location`, {
      method: 'POST',
      body: JSON.stringify(locationData),
    });
  }

  async endTrip(tripId: string, location: { endLatitude: number; endLongitude: number }): Promise<ApiResponse<Trip>> {
    return this.request<ApiResponse<Trip>>(`/api/trips/${tripId}/end`, {
      method: 'POST',
      body: JSON.stringify(location),
    });
  }

  // SOS Emergency APIs
  async triggerSos(sosData: {
    location: string;
    latitude: number;
    longitude: number;
    sosType: string;
    description: string;
    tripId?: string;
  }): Promise<ApiResponse<SosRequest>> {
    return this.request<ApiResponse<SosRequest>>('/api/sos', {
      method: 'POST',
      body: JSON.stringify(sosData),
    });
  }

  async getMySosAlerts(params?: {
    status?: string;
    limit?: number;
    offset?: number;
  }): Promise<{ sosRequests: SosRequest[] }> {
    const queryParams = new URLSearchParams();
    if (params?.status) queryParams.append('status', params.status);
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.offset) queryParams.append('offset', params.offset.toString());

    const endpoint = `/api/sos/my-alerts${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    return this.request<{ sosRequests: SosRequest[] }>(endpoint);
  }

  async getSosDetails(sosId: string): Promise<{ sosRequest: SosRequest }> {
    return this.request<{ sosRequest: SosRequest }>(`/api/sos/${sosId}`);
  }

  async updateSosStatus(sosId: string, statusData: {
    status: string;
    description?: string;
  }): Promise<ApiResponse<SosRequest>> {
    return this.request<ApiResponse<SosRequest>>(`/api/sos/${sosId}/status`, {
      method: 'PUT',
      body: JSON.stringify(statusData),
    });
  }

  // Community Reports APIs
  async createCommunityReport(reportData: {
    title: string;
    issueDescription: string;
    location: string;
    latitude: number;
    longitude: number;
    incidentType: string;
    priority: string;
    imageUrl?: string;
    tripId?: string;
  }): Promise<ApiResponse<CommunityPost>> {
    return this.request<ApiResponse<CommunityPost>>('/api/community', {
      method: 'POST',
      body: JSON.stringify(reportData),
    });
  }

  async getCommunityReports(params?: {
    location?: string;
    incidentType?: string;
    priority?: string;
    status?: string;
    lat?: number;
    lng?: number;
    radius?: number;
    limit?: number;
    offset?: number;
  }): Promise<{ reports: CommunityPost[]; total: number; filters: any }> {
    const queryParams = new URLSearchParams();
    Object.entries(params || {}).forEach(([key, value]) => {
      if (value !== undefined) queryParams.append(key, value.toString());
    });

    const endpoint = `/api/community${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    return this.request<{ reports: CommunityPost[]; total: number; filters: any }>(endpoint);
  }

  async getCommunityReportDetails(reportId: string): Promise<{ report: CommunityPost }> {
    return this.request<{ report: CommunityPost }>(`/api/community/${reportId}`);
  }

  async likeCommunityReport(reportId: string, action: 'like' | 'unlike'): Promise<ApiResponse<any>> {
    return this.request<ApiResponse<any>>(`/api/community/${reportId}/like`, {
      method: 'POST',
      body: JSON.stringify({ action }),
    });
  }

  async dislikeCommunityReport(reportId: string, action: 'dislike' | 'remove_dislike'): Promise<ApiResponse<any>> {
    return this.request<ApiResponse<any>>(`/api/community/${reportId}/dislike`, {
      method: 'POST',
      body: JSON.stringify({ action }),
    });
  }

  // Admin APIs
  async adminLogin(credentials: LoginRequest): Promise<LoginResponse> {
    console.log('🔐 Admin Login Attempt:', { email: credentials.email });
    
    const response = await this.request<AdminLoginResponse>('/api/admin/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });

    console.log('🔐 Admin Login Response:', response);

    if (response.token) {
      console.log('💾 Setting token in localStorage');
      this.setToken(response.token);
    }

    // Transform admin response to match LoginResponse interface
    const transformedResponse: LoginResponse = {
      message: response.message,
      user: response.admin, // Map admin to user for consistency
      token: response.token
    };

    console.log('🔄 Transformed Response:', transformedResponse);
    return transformedResponse;
  }

  async getAdminOverview(): Promise<AdminOverview> {
    return this.request<AdminOverview>('/api/admin/dashboard/overview');
  }

  async getTripsByLocation(location: string, params?: {
    status?: string;
    limit?: number;
    offset?: number;
  }): Promise<{ trips: Trip[]; location: string; total: number }> {
    const queryParams = new URLSearchParams();
    if (params?.status) queryParams.append('status', params.status);
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.offset) queryParams.append('offset', params.offset.toString());

    const endpoint = `/api/admin/trips/location/${location}${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    return this.request<{ trips: Trip[]; location: string; total: number }>(endpoint);
  }

  async getAllSosRequests(params?: {
    status?: string;
    location?: string;
    sosType?: string;
    limit?: number;
    offset?: number;
  }): Promise<{ sosRequests: SosRequest[] }> {
    const queryParams = new URLSearchParams();
    Object.entries(params || {}).forEach(([key, value]) => {
      if (value !== undefined) queryParams.append(key, value.toString());
    });

    const endpoint = `/api/admin/sos-requests${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    return this.request<{ sosRequests: SosRequest[] }>(endpoint);
  }

  async getAllCommunityReports(params?: {
    status?: string;
    priority?: string;
    incidentType?: string;
    location?: string;
    limit?: number;
    offset?: number;
  }): Promise<{ reports: CommunityPost[] }> {
    const queryParams = new URLSearchParams();
    Object.entries(params || {}).forEach(([key, value]) => {
      if (value !== undefined) queryParams.append(key, value.toString());
    });

    const endpoint = `/api/admin/community-reports${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    return this.request<{ reports: CommunityPost[] }>(endpoint);
  }

  // Get all trips from all locations (optimized)
  async getAllTrips(params?: {
    status?: string;
    limit?: number;
    offset?: number;
  }): Promise<{ trips: Trip[]; total: number }> {
    console.log('🚀 Getting trips from all locations (optimized)...');
    
    // Common Indian tourist locations - only check major ones to reduce API calls
    const majorLocations = ['Mumbai', 'Delhi', 'Bangalore', 'Chennai', 'Kolkata', 'Hyderabad'];
    let allTrips: Trip[] = [];
    let totalCount = 0;
    
    // Use Promise.allSettled for parallel requests instead of sequential
    const locationPromises = majorLocations.map(async (location) => {
      try {
        console.log(`📍 Fetching trips from ${location}...`);
        const response = await this.getTripsByLocation(location, params);
        console.log(`✅ Found ${response.trips.length} trips in ${location}`);
        return response;
      } catch (error) {
        console.log(`⚠️ No trips found in ${location}`);
        return { trips: [], total: 0, location };
      }
    });
    
    const results = await Promise.allSettled(locationPromises);
    
    results.forEach((result) => {
      if (result.status === 'fulfilled' && result.value) {
        allTrips = [...allTrips, ...result.value.trips];
        totalCount += result.value.total;
      }
    });
    
    console.log(`🎯 Total trips found: ${allTrips.length}`);
    return { trips: allTrips, total: totalCount };
  }

  // Get unique users from all trips
  async getAllUsers(): Promise<{ users: User[] }> {
    console.log('👥 Getting all users from trips...');
    
    const { trips } = await this.getAllTrips({ limit: 1000 });
    
    // Extract unique users from trips
    const uniqueUsersMap = new Map<string, User>();
    trips.forEach(trip => {
      if (trip.user && !uniqueUsersMap.has(trip.user.id)) {
        uniqueUsersMap.set(trip.user.id, trip.user);
      }
    });
    
    const users = Array.from(uniqueUsersMap.values());
    console.log(`👥 Found ${users.length} unique users`);
    
    return { users };
  }

  // Update SOS status using the correct API endpoints
  // For admin actions, use: PUT /api/admin/sos-requests/:id/status
  // Admin can update to: ACKNOWLEDGED, RESOLVED, FALSE_ALARM
  // All admin status updates use adminComments and responseTime fields
  
  // Acknowledge SOS (for admin use) - uses admin endpoint
  async acknowledgeSosRequest(sosId: string, comment: string): Promise<ApiResponse<SosRequest>> {
    console.log(`🚨 acknowledgeSosRequest called with:`, { sosId, comment });
    console.log(`🔑 Current token:`, this.token ? 'Present' : 'Missing');
    
    const requestBody = {
      status: 'ACKNOWLEDGED',
      adminComments: comment,
      responseTime: new Date().toISOString()
    };
    
    console.log(`📦 Admin Request body:`, requestBody);
    
    try {
      const response = await this.request<ApiResponse<SosRequest>>(`/api/admin/sos-requests/${sosId}/status`, {
        method: 'PUT',
        body: JSON.stringify(requestBody),
      });
      
      console.log('✅ SOS request acknowledged successfully:', response);
      return response;
    } catch (error) {
      console.error('❌ acknowledgeSosRequest failed:', error);
      throw error;
    }
  }

  // Resolve SOS request using admin endpoint
  async resolveSosRequest(sosId: string, comment: string): Promise<ApiResponse<SosRequest>> {
    console.log(`✅ Resolving SOS request ${sosId} with comment:`, comment);
    console.log(`🔑 Current token:`, this.token ? 'Present' : 'Missing');
    
    const requestBody = {
      status: 'RESOLVED',
      adminComments: comment,
      responseTime: new Date().toISOString()
    };
    
    console.log(`📦 Admin Request body:`, requestBody);
    
    try {
      const response = await this.request<ApiResponse<SosRequest>>(`/api/admin/sos-requests/${sosId}/status`, {
        method: 'PUT',
        body: JSON.stringify(requestBody),
      });
      
      console.log('✅ SOS request resolved successfully:', response);
      return response;
    } catch (error) {
      console.error('❌ resolveSosRequest failed:', error);
      throw error;
    }
  }

  // Mark SOS as false alarm using admin endpoint
  async markSosAsFalseAlarm(sosId: string, comment: string): Promise<ApiResponse<SosRequest>> {
    console.log(`⚠️ Marking SOS request ${sosId} as false alarm with comment:`, comment);
    console.log(`🔑 Current token:`, this.token ? 'Present' : 'Missing');
    
    const requestBody = {
      status: 'FALSE_ALARM',
      adminComments: comment,
      responseTime: new Date().toISOString()
    };
    
    console.log(`📦 Admin Request body:`, requestBody);
    
    try {
      const response = await this.request<ApiResponse<SosRequest>>(`/api/admin/sos-requests/${sosId}/status`, {
        method: 'PUT',
        body: JSON.stringify(requestBody),
      });
      
      console.log('✅ SOS request marked as false alarm successfully:', response);
      return response;
    } catch (error) {
      console.error('❌ markSosAsFalseAlarm failed:', error);
      throw error;
    }
  }

  // Update community report status
  async updateCommunityReportStatus(reportId: string, status: 'UNDER_REVIEW' | 'RESOLVED' | 'CLOSED', comment?: string): Promise<ApiResponse<CommunityPost>> {
    console.log(`📱 Updating community report ${reportId} to ${status}`);
    
    const body: any = { status };
    if (comment) {
      body.adminComment = comment;
    }
    
    const response = await this.request<ApiResponse<CommunityPost>>(`/api/admin/community-reports/${reportId}/status`, {
      method: 'PUT',
      body: JSON.stringify(body),
    });
    
    console.log('✅ Community report status updated successfully');
    return response;
  }
}

// Export singleton instance
export const apiService = new ApiService();
export default apiService;
