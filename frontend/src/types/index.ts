// User Types
export interface User {
  userId: number;
  name: string;
  email: string;
  phoneNumber: string;
  role: UserRole;
  createdAt: string;
  location: Location;
  province?: string;
  district?: string;
  sector?: string;
  cell?: string;
  village?: string;
  accountLocked?: boolean;
  emailVerified?: boolean;
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

// Request Category
export const RequestCategory = {
  GENERAL_HELP: 'GENERAL_HELP',
  TRANSPORTATION: 'TRANSPORTATION',
  TECHNOLOGY_SUPPORT: 'TECHNOLOGY_SUPPORT',
  SHOPPING_AND_ERRANDS: 'SHOPPING_AND_ERRANDS',
  TUTORING_AND_EDUCATION: 'TUTORING_AND_EDUCATION',
  HOUSEHOLD_TASKS: 'HOUSEHOLD_TASKS',
  HEALTHCARE_ASSISTANCE: 'HEALTHCARE_ASSISTANCE',
  OTHERS: 'OTHERS'
} as const;

export type RequestCategory = typeof RequestCategory[keyof typeof RequestCategory];

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
  category: RequestCategory;
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
  locationId: number;
  sector?: string;
  cell?: string;
  village?: string;
  skills?: { skillId: number }[];
}

export interface AuthResponse {
  token: string;
  user: User;
  backupCodes?: string[];
  requires2FA?: boolean;
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