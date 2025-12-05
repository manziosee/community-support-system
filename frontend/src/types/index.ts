// User Types
export interface User {
  userId: number;
  name: string;
  email: string;
  phoneNumber: string;
  role: UserRole;
  createdAt: string;
  location: Location;
  sector?: string;
  cell?: string;
  village?: string;
  skills?: Skill[];
}

export const UserRole = {
  CITIZEN: 'CITIZEN',
  VOLUNTEER: 'VOLUNTEER',
  ADMIN: 'ADMIN'
} as const;

export type UserRole = typeof UserRole[keyof typeof UserRole];

// Location Types
export interface Location {
  locationId: number;
  province: string;
  district: string;
  sector?: string;
  cell?: string;
  village?: string;
  provinceCode: string;
}

// Skill Types
export interface Skill {
  skillId: number;
  skillName: string;
  description: string;
}

// Request Status
export const RequestStatus = {
  PENDING: 'PENDING',
  ACCEPTED: 'ACCEPTED',
  COMPLETED: 'COMPLETED',
  CANCELLED: 'CANCELLED'
} as const;

export type RequestStatus = typeof RequestStatus[keyof typeof RequestStatus];

// Assignment Types (defined before Request to avoid circular reference)
export interface Assignment {
  assignmentId: number;
  acceptedAt: string;
  completedAt?: string;
  request?: Request;
  volunteer: User;
}

// Request Types
export interface Request {
  requestId: number;
  title: string;
  description: string;
  status: RequestStatus;
  createdAt: string;
  updatedAt?: string;
  citizen: User;
  assignments?: Assignment[];
}

// Notification Types
export interface Notification {
  notificationId: number;
  message: string;
  isRead: boolean;
  createdAt: string;
  user: User;
}

// API Response Types
export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

export interface PaginatedResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
}

// Auth Types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  phoneNumber: string;
  role: UserRole;
  location: {
    locationId: number;
  };
  sector?: string;
  cell?: string;
  village?: string;
  skills?: { skillId: number }[];
}

export interface AuthResponse {
  token: string;
  user: User;
}

// Dashboard Stats
export interface DashboardStats {
  totalUsers: number;
  totalVolunteers: number;
  totalCitizens: number;
  totalRequests: number;
  pendingRequests: number;
  completedRequests: number;
  totalAssignments: number;
}