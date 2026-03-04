// ─── User Types ───────────────────────────────────────────────────────────────
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
  availabilityStatus?: VolunteerStatus;
  gamificationProfile?: GamificationProfile;
}

export const UserRole = {
  CITIZEN: 'CITIZEN',
  VOLUNTEER: 'VOLUNTEER',
  ADMIN: 'ADMIN'
} as const;
export type UserRole = typeof UserRole[keyof typeof UserRole];

// ─── Location Types ───────────────────────────────────────────────────────────
export interface Location {
  locationId: number;
  province: string;
  district: string;
  sector?: string;
  cell?: string;
  village?: string;
  provinceCode: string;
}

// ─── Skill Types ──────────────────────────────────────────────────────────────
export interface Skill {
  skillId: number;
  skillName: string;
  description: string;
}

// ─── Request Status & Category ────────────────────────────────────────────────
export const RequestStatus = {
  PENDING: 'PENDING',
  ACCEPTED: 'ACCEPTED',
  COMPLETED: 'COMPLETED',
  CANCELLED: 'CANCELLED'
} as const;
export type RequestStatus = typeof RequestStatus[keyof typeof RequestStatus];

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

// ─── Request Priority ─────────────────────────────────────────────────────────
export const RequestPriority = {
  NORMAL: 'NORMAL',
  URGENT: 'URGENT'
} as const;
export type RequestPriority = typeof RequestPriority[keyof typeof RequestPriority];

// ─── Assignment Types ─────────────────────────────────────────────────────────
export interface Assignment {
  assignmentId: number;
  acceptedAt: string;
  completedAt?: string;
  request?: Request;
  volunteer: User;
  rating?: Rating;
  notes?: string;
}

// ─── Request Types ────────────────────────────────────────────────────────────
export interface Request {
  requestId: number;
  title: string;
  description: string;
  category?: RequestCategory | string;
  status: RequestStatus;
  priority?: RequestPriority;
  createdAt: string;
  updatedAt?: string;
  citizen: User;
  assignments?: Assignment[];
  isRecurring?: boolean;
  recurringSchedule?: RecurringSchedule;
  mediaUrls?: string[];
  estimatedDuration?: number; // in minutes
}

// ─── Notification Types ───────────────────────────────────────────────────────
export interface Notification {
  notificationId: number;
  message: string;
  isRead: boolean;
  createdAt: string;
  user: User;
  type?: NotificationType;
  actionUrl?: string;
}

export const NotificationType = {
  REQUEST: 'REQUEST',
  ASSIGNMENT: 'ASSIGNMENT',
  RATING: 'RATING',
  BADGE: 'BADGE',
  SYSTEM: 'SYSTEM',
  REMINDER: 'REMINDER'
} as const;
export type NotificationType = typeof NotificationType[keyof typeof NotificationType];

// ─── API Response Types ───────────────────────────────────────────────────────
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

// ─── Auth Types ───────────────────────────────────────────────────────────────
export interface LoginRequest {
  email: string;
  password: string;
  twoFactorCode?: string;
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
  requiresTwoFactor?: boolean;
  message?: string;
}

// ─── Dashboard Stats ──────────────────────────────────────────────────────────
export interface DashboardStats {
  totalUsers: number;
  totalVolunteers: number;
  totalCitizens: number;
  totalRequests: number;
  pendingRequests: number;
  completedRequests: number;
  totalAssignments: number;
}

// ─── Analytics Types ──────────────────────────────────────────────────────────
export interface CitizenAnalytics {
  totalRequests: number;
  pendingRequests: number;
  acceptedRequests: number;
  completedRequests: number;
  cancelledRequests: number;
  statusBreakdown: StatusBreakdown[];
  averageResponseTime?: number; // hours
  satisfactionScore?: number;
}

export interface VolunteerAnalytics {
  totalAssignments: number;
  activeAssignments: number;
  completedAssignments: number;
  statusBreakdown: StatusBreakdown[];
  averageRating?: number;
  totalHours?: number;
  completionRate?: number;
  responseTime?: number; // minutes
}

export interface StatusBreakdown {
  status: string;
  count: number;
}

export interface AdvancedAnalytics {
  weeklyCompletions: { week: string; count: number }[];
  categoryBreakdown: { category: string; count: number }[];
  geographicData: { province: string; count: number }[];
  volunteerRetentionRate: number;
  averageResponseTime: number;
  npsScore: number;
  peakUsageTimes: { hour: number; count: number }[];
  monthlyGrowth: { month: string; requests: number; completions: number }[];
}

// ─── Rating & Review Types ────────────────────────────────────────────────────
export interface Rating {
  ratingId: number;
  score: number; // 1-5
  review?: string;
  createdAt: string;
  assignment: Assignment;
  citizen: User;
  volunteer: User;
}

export interface ReviewFormData {
  score: number;
  review: string;
  assignmentId: number;
  citizenId: number;
  volunteerId: number;
}

// ─── Volunteer Status ─────────────────────────────────────────────────────────
export const VolunteerStatus = {
  ONLINE: 'ONLINE',
  OFFLINE: 'OFFLINE',
  BUSY: 'BUSY'
} as const;
export type VolunteerStatus = typeof VolunteerStatus[keyof typeof VolunteerStatus];

// ─── Gamification Types ───────────────────────────────────────────────────────
export const VolunteerLevel = {
  BRONZE: 'BRONZE',
  SILVER: 'SILVER',
  GOLD: 'GOLD',
  PLATINUM: 'PLATINUM'
} as const;
export type VolunteerLevel = typeof VolunteerLevel[keyof typeof VolunteerLevel];

export interface GamificationProfile {
  userId: number;
  points: number;
  level: VolunteerLevel;
  badges: VolunteerBadge[];
  achievements: Achievement[];
  rank?: number;
  weeklyPoints?: number;
  monthlyPoints?: number;
  totalHoursServed?: number;
}

export interface VolunteerBadge {
  badgeId: string;
  name: string;
  description: string;
  icon: string;
  earnedAt?: string;
  rarity: 'COMMON' | 'RARE' | 'EPIC' | 'LEGENDARY';
}

export interface Achievement {
  achievementId: string;
  name: string;
  description: string;
  icon: string;
  progress: number;
  target: number;
  completedAt?: string;
  points: number;
}

export interface LeaderboardEntry {
  rank: number;
  user: User;
  points: number;
  completedAssignments: number;
  level: VolunteerLevel;
  averageRating?: number;
  badges: VolunteerBadge[];
}

// ─── Scheduling Types ─────────────────────────────────────────────────────────
export interface AvailabilitySlot {
  slotId: string;
  dayOfWeek: number; // 0=Sunday, 1=Monday...
  startHour: number;
  endHour: number;
  isRecurring: boolean;
  date?: string; // specific date if not recurring
}

export interface RecurringSchedule {
  frequency: 'DAILY' | 'WEEKLY' | 'BIWEEKLY' | 'MONTHLY';
  dayOfWeek?: number;
  dayOfMonth?: number;
  time?: string;
}

export interface Appointment {
  appointmentId: string;
  title: string;
  description?: string;
  requestId?: number;
  volunteerId?: number;
  citizenId?: number;
  scheduledAt: string;
  durationMinutes: number;
  status: 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED';
  notes?: string;
}

export interface ExpenseReport {
  expenseId: string;
  assignmentId: number;
  amount: number;
  currency: string;
  category: 'TRANSPORT' | 'SUPPLIES' | 'FOOD' | 'OTHER';
  description: string;
  receiptUrl?: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'REIMBURSED';
  submittedAt: string;
  volunteer: User;
}

// ─── Community Types ──────────────────────────────────────────────────────────
export interface BulletinPost {
  postId: string;
  title: string;
  content: string;
  category: 'ANNOUNCEMENT' | 'EVENT' | 'RESOURCE' | 'SUCCESS_STORY' | 'DISCUSSION';
  author: User;
  createdAt: string;
  updatedAt?: string;
  likes: number;
  comments: number;
  isPinned?: boolean;
  imageUrl?: string;
  tags?: string[];
}

export interface CommunityEvent {
  eventId: string;
  title: string;
  description: string;
  type: 'VOLUNTEER_DRIVE' | 'CLEANUP' | 'TRAINING' | 'MEETING' | 'OTHER';
  location: string;
  startDate: string;
  endDate: string;
  maxParticipants?: number;
  currentParticipants: number;
  organizer: User;
}

// ─── i18n Types ───────────────────────────────────────────────────────────────
export type Language = 'en' | 'rw' | 'fr' | 'sw';

export interface TranslationKeys {
  // Navigation
  nav_dashboard: string;
  nav_requests: string;
  nav_create_request: string;
  nav_available_requests: string;
  nav_assignments: string;
  nav_notifications: string;
  nav_profile: string;
  nav_settings: string;
  nav_leaderboard: string;
  nav_community: string;
  nav_availability: string;
  nav_achievements: string;
  nav_sign_out: string;
  nav_my_skills: string;
  nav_user_management: string;
  nav_skill_management: string;
  nav_locations: string;
  nav_analytics: string;
  nav_advanced_reports: string;
  nav_system_settings: string;
  nav_profile_settings: string;
  // Sections
  section_my_services: string;
  section_community: string;
  section_achievements: string;
  section_users: string;
  section_requests: string;
  section_system: string;
  section_account: string;
  // Common actions
  action_create: string;
  action_edit: string;
  action_delete: string;
  action_save: string;
  action_cancel: string;
  action_submit: string;
  action_view_all: string;
  action_search: string;
  action_filter: string;
  action_export: string;
  action_loading: string;
  // Status labels
  status_pending: string;
  status_accepted: string;
  status_completed: string;
  status_cancelled: string;
  status_online: string;
  status_offline: string;
  status_busy: string;
  status_urgent: string;
  status_normal: string;
  // Dashboard
  dashboard_welcome: string;
  dashboard_total_requests: string;
  dashboard_completed: string;
  dashboard_pending: string;
  dashboard_notifications: string;
  dashboard_my_assignments: string;
  // Gamification
  gamification_points: string;
  gamification_level: string;
  gamification_badges: string;
  gamification_achievements: string;
  gamification_leaderboard: string;
  gamification_rank: string;
  // Greetings
  greeting_morning: string;
  greeting_afternoon: string;
  greeting_evening: string;
  // Misc
  misc_no_data: string;
  misc_loading: string;
  misc_error: string;
  misc_success: string;
  misc_confirm_delete: string;
  misc_search_placeholder: string;
  common_language: string;
}

// ─── Notification Preferences ─────────────────────────────────────────────────
export interface NotificationPreferences {
  emailEnabled: boolean;
  smsEnabled: boolean;
  pushEnabled: boolean;
  digestMode: boolean;
  quietHoursStart?: number;
  quietHoursEnd?: number;
  requestUpdates: boolean;
  assignmentUpdates: boolean;
  ratingAlerts: boolean;
  badgeAlerts: boolean;
  weeklyDigest: boolean;
}
