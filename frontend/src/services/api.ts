import axios from 'axios';
import type { AuthResponse, LoginRequest, RegisterRequest } from '../types';

const API_BASE_URL = 'http://localhost:8080/api';

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
};

// Requests API
export const requestsApi = {
  getAll: (page = 0, size = 10) => 
    api.get(`/requests?page=${page}&size=${size}`),
  
  getById: (id: number) => 
    api.get(`/requests/${id}`),
  
  create: (requestData: { title: string; description: string; citizen: { userId: number } }) => 
    api.post('/requests', requestData),
  
  update: (id: number, requestData: Partial<{ title: string; description: string }>) => 
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
    api.get(`/requests/province/${province}`),
  
  searchByTitle: (title: string) => 
    api.get(`/requests/search/title/${title}`),
  
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
  
  getUnreadByUser: (userId: number) => 
    api.get(`/notifications/user/${userId}/unread`),
  
  markAsRead: (id: number) => 
    api.patch(`/notifications/${id}/read`),
  
  markAllAsRead: (userId: number) => 
    api.patch(`/notifications/user/${userId}/mark-all-read`),
  
  getUnreadCount: (userId: number) => 
    api.get(`/notifications/user/${userId}/unread/count`),
};

// Locations API
export const locationsApi = {
  getAll: () => 
    api.get('/locations'),
  
  getById: (id: number) => 
    api.get(`/locations/${id}`),
  
  getProvinces: () => 
    api.get('/locations/provinces'),
  
  getDistrictsByProvince: (province: string) => 
    api.get(`/locations/districts/${province}`),
  
  getByProvince: (province: string) => 
    api.get(`/locations/province/${province}`),
};

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