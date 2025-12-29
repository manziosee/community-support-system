import axios from 'axios';
import type { AuthResponse, LoginRequest, RegisterRequest } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 
  (import.meta.env.PROD 
    ? 'https://community-support-system.fly.dev/api' 
    : window.location.hostname === 'localhost' && window.location.port === '3001'
      ? 'http://localhost:8080/api'
      : 'https://community-support-system.fly.dev/api'
  );
console.log('API Base URL:', API_BASE_URL);
console.log('Environment:', import.meta.env.PROD ? 'Production' : 'Development');
console.log('Current URL:', window.location.href);

// Create axios instance
export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authApi = {
  login: (credentials: LoginRequest) => 
    api.post<AuthResponse>('/auth/login', credentials),
  
  register: (userData: RegisterRequest) => 
    api.post<AuthResponse>('/auth/register', userData),
  
  forgotPassword: (email: string) => 
    api.post('/auth/forgot-password', { email }),
  
  resetPassword: (token: string, password: string) => 
    api.post('/auth/reset-password', { token, password }),
  
  verifyEmail: (token: string) => 
    api.post('/auth/verify-email', { token }),
  
  resendVerification: (email: string) => 
    api.post('/auth/resend-verification', { email }),
  
  // Two-Factor Authentication
  send2FACode: () => 
    api.post('/auth/2fa/send-code'),
  
  verify2FASetup: (code: string) => 
    api.post('/auth/2fa/verify-setup', { code }),
  
  verify2FA: (data: { email: string; password: string; code: string; isBackupCode?: boolean }) => 
    api.post<AuthResponse>('/auth/2fa/verify', data),
  
  resend2FACode: (email: string) => 
    api.post('/auth/2fa/resend', { email }),
  
  disable2FA: (password: string) => 
    api.post('/auth/2fa/disable', { password }),
};

// Users API
export const usersApi = {
  getAll: (page = 0, size = 10, role?: string, province?: string) => 
    api.get(`/users/search?page=${page}&size=${size}${role ? `&role=${role}` : ''}${province ? `&province=${province}` : ''}`),
  
  getById: (id: number) => 
    api.get(`/users/${id}`),
  
  getByEmail: (email: string) => 
    api.get(`/users/email/${email}`),
  
  update: (id: number, userData: Partial<RegisterRequest>) => 
    api.put(`/users/${id}`, userData),
  
  delete: (id: number) => 
    api.delete(`/users/${id}`),
  
  getVolunteers: () => 
    api.get('/users/role/VOLUNTEER'),
  
  getCitizens: () => 
    api.get('/users/role/CITIZEN'),
  
  searchByName: (name: string) => 
    api.get(`/users/search/name/${name}`),
  
  // Location-based queries
  getByProvince: (province: string) => 
    api.get(`/users/province/${encodeURIComponent(province)}`),
  
  getByDistrict: (district: string) => 
    api.get(`/users/district/${encodeURIComponent(district)}`),
  
  getByProvinceAndDistrict: (province: string, district: string) => 
    api.get(`/users/location/${encodeURIComponent(province)}/${encodeURIComponent(district)}`),
  
  getBySector: (sector: string) => 
    api.get(`/users/sector/${encodeURIComponent(sector)}`),
  
  getByCell: (cell: string) => 
    api.get(`/users/cell/${encodeURIComponent(cell)}`),
  
  getByVillage: (village: string) => 
    api.get(`/users/village/${encodeURIComponent(village)}`),
  
  // Skills management
  addSkill: (userId: number, skillId: number) => 
    api.post(`/users/${userId}/skills/${skillId}`),
  
  removeSkill: (userId: number, skillId: number) => 
    api.delete(`/users/${userId}/skills/${skillId}`),
  
  getSkills: (userId: number) => 
    api.get(`/users/${userId}/skills`),
};

// Requests API
export const requestsApi = {
  getAll: (page = 0, size = 10) => 
    api.get(`/requests?page=${page}&size=${size}`),
  
  getById: (id: number) => 
    api.get(`/requests/${id}`),
  
  create: (requestData: { title: string; description: string; category: string; citizen: { userId: number } }) => 
    api.post('/requests', requestData),
  
  update: (id: number, requestData: Partial<{ title: string; description: string; category: string }>) => 
    api.put(`/requests/${id}`, requestData),
  
  delete: (id: number) => 
    api.delete(`/requests/${id}`),
  
  getByStatus: (status: string) => 
    api.get(`/requests/status/${status}`),
  
  getByCitizen: (citizenId: number) => 
    api.get(`/requests/citizen/${citizenId}`),
  
  getPending: () => 
    api.get('/requests/pending'),
  
  getByProvince: (province: string) => 
    api.get(`/requests/province/${encodeURIComponent(province)}`),
  
  getPendingByProvince: (province: string) => 
    api.get(`/requests/pending/province/${encodeURIComponent(province)}`),
  
  search: (params: {
    status?: string;
    province?: string;
    category?: string;
    title?: string;
    citizenId?: number;
    page?: number;
    size?: number;
    sortBy?: string;
    sortDir?: string;
  }) => {
    const queryParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        queryParams.append(key, value.toString());
      }
    });
    return api.get(`/requests/search?${queryParams.toString()}`);
  },
  
  getCitizenStats: (citizenId: number) => 
    api.get(`/requests/citizen/${citizenId}/stats`),
  
  updateStatus: (id: number, status: string) => 
    api.patch(`/requests/${id}/status?status=${status}`),
};

// Assignments API
export const assignmentsApi = {
  getAll: () => 
    api.get('/assignments'),
  
  getById: (id: number) => 
    api.get(`/assignments/${id}`),
  
  create: (assignmentData: { request: { requestId: number }; volunteer: { userId: number } }) => 
    api.post('/assignments', assignmentData),
  
  update: (id: number, assignmentData: any) => 
    api.put(`/assignments/${id}`, assignmentData),
  
  delete: (id: number) => 
    api.delete(`/assignments/${id}`),
  
  getByVolunteer: (volunteerId: number) => 
    api.get(`/assignments/volunteer/${volunteerId}`),
  
  complete: (id: number) => 
    api.patch(`/assignments/${id}/complete`),
  
  getCompleted: () => 
    api.get('/assignments/completed'),
  
  getPending: () => 
    api.get('/assignments/pending'),
};

// Notifications API
export const notificationsApi = {
  getAll: () => 
    api.get('/notifications'),
  
  getById: (id: number) => 
    api.get(`/notifications/${id}`),
  
  create: (notificationData: { message: string; user: { userId: number } }) => 
    api.post('/notifications', notificationData),
  
  update: (id: number, notificationData: any) => 
    api.put(`/notifications/${id}`, notificationData),
  
  delete: (id: number) => 
    api.delete(`/notifications/${id}`),
  
  getByUser: (userId: number) => 
    api.get(`/notifications/user/${userId}`),
  
  getByUserPaginated: (userId: number, params: {
    isRead?: boolean;
    search?: string;
    page?: number;
    size?: number;
    sortBy?: string;
    sortDir?: string;
  }) => {
    const queryParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        queryParams.append(key, value.toString());
      }
    });
    return api.get(`/notifications/user/${userId}/paginated?${queryParams.toString()}`);
  },
  
  getUnreadByUser: (userId: number) => 
    api.get(`/notifications/user/${userId}/unread`),
  
  markAsRead: (id: number) => 
    api.patch(`/notifications/${id}/read`),
  
  markAllAsRead: (userId: number) => 
    api.patch(`/notifications/user/${userId}/mark-all-read`),
  
  getUnreadCount: (userId: number) => 
    api.get(`/notifications/user/${userId}/unread/count`),
  
  getUserStats: (userId: number) => 
    api.get(`/notifications/user/${userId}/stats`),
};

// Locations API
export const locationsApi = {
  getAll: () => 
    api.get('/locations'),
  
  getById: (id: number) => 
    api.get(`/locations/${id}`),
  
  getProvinces: async () => {
    try {
      console.log('Fetching provinces from:', `${API_BASE_URL}/locations/provinces`);
      const response = await api.get('/locations/provinces');
      console.log('Provinces response:', response);
      return response;
    } catch (error) {
      console.error('Error fetching provinces:', error);
      throw error;
    }
  },
  
  getDistrictsByProvince: async (province: string) => {
    try {
      const encodedProvince = encodeURIComponent(province);
      const url = `/locations/districts/${encodedProvince}`;
      console.log('Fetching districts from:', `${API_BASE_URL}${url}`);
      const response = await api.get(url);
      console.log('Districts response for', province, ':', response);
      return response;
    } catch (error) {
      console.error('Error fetching districts for', province, ':', error);
      throw error;
    }
  },
  
  getByProvince: (province: string) => 
    api.get(`/locations/province/${province}`),
};

// Skills API
// Skills API
export const skillsApi = {
  getAll: () => 
    api.get('/skills'),
  
  getById: (id: number) => 
    api.get(`/skills/${id}`),
  
  create: (skillData: { skillName: string; description: string }) => 
    api.post('/skills', skillData),
  
  update: (id: number, skillData: { skillName: string; description: string }) => 
    api.put(`/skills/${id}`, skillData),
  
  delete: (id: number) => 
    api.delete(`/skills/${id}`),
  
  getPopular: () => 
    api.get('/skills/popular'),
};

// Categories API
export const categoriesApi = {
  getAll: () => 
    api.get('/categories'),
};

// Rwanda Locations API (External API)
export const rwandaLocationsApi = {
  getProvinces: () => api.get('/rwanda-locations/provinces'),
  getDistricts: (province: string) => api.get(`/rwanda-locations/districts?province=${encodeURIComponent(province)}`),
  getSectors: (province: string, district: string) => 
    api.get(`/rwanda-locations/sectors?province=${encodeURIComponent(province)}&district=${encodeURIComponent(district)}`),
  getCells: (province: string, district: string, sector: string) => 
    api.get(`/rwanda-locations/cells?province=${encodeURIComponent(province)}&district=${encodeURIComponent(district)}&sector=${encodeURIComponent(sector)}`),
  getVillages: (province: string, district: string, sector: string, cell: string) => 
    api.get(`/rwanda-locations/villages?province=${encodeURIComponent(province)}&district=${encodeURIComponent(district)}&sector=${encodeURIComponent(sector)}&cell=${encodeURIComponent(cell)}`),
};

// Settings API
export const settingsApi = {
  getUserSettings: (userId: number) => 
    api.get(`/settings/${userId}`),
  
  updatePassword: (userId: number, passwordData: { currentPassword: string; newPassword: string }) => 
    api.patch(`/settings/password/${userId}`, passwordData),
  
  updateNotificationPreferences: (userId: number, preferences: Record<string, boolean>) => 
    api.patch(`/settings/notifications/${userId}`, preferences),
  
  updateProfile: (userId: number, profileData: Record<string, any>) => 
    api.patch(`/settings/profile/${userId}`, profileData),
};

// Admin API
export const adminApi = {
  getDashboardStats: () => 
    api.get('/admin/dashboard/stats'),
  
  getAllUsers: (page = 0, size = 20) => 
    api.get(`/admin/users/all?page=${page}&size=${size}`),
  
  updateUserStatus: (id: number, status: string) => 
    api.put(`/admin/users/${id}/status`, { status }),
  
  deleteUser: (id: number) => 
    api.delete(`/admin/users/${id}`),
  
  getAllRequests: () => 
    api.get('/admin/requests/all'),
  
  moderateRequest: (id: number, action: string) => 
    api.patch(`/admin/requests/${id}/moderate`, { action }),
  
  getAnalytics: () => 
    api.get('/admin/analytics/reports'),
  
  broadcastNotification: (message: string) => 
    api.post('/admin/notifications/broadcast', { message }),
};