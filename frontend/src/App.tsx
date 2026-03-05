import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { LanguageProvider } from './contexts/LanguageContext';
import { WebSocketProvider } from './contexts/WebSocketContext';
import { GamificationProvider } from './contexts/GamificationContext';
import { TranslationSync } from './components/TranslationSync';
import Layout from './components/layout/Layout';
import { UserRole } from './types';
import ConfettiEffect from './components/common/ConfettiEffect';
import { useGamification } from './contexts/GamificationContext';
import './i18n/config';

// ─── Auth Pages ───────────────────────────────────────────────────────────────
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage';
import ResetPasswordPage from './pages/auth/ResetPasswordPage';
import TwoFactorSetupPage from './pages/auth/TwoFactorSetupPage';
import TwoFactorVerifyPage from './pages/auth/TwoFactorVerifyPage';
import EmailVerificationPage from './pages/auth/EmailVerificationPage';

// ─── Dashboard Pages ──────────────────────────────────────────────────────────
import CitizenDashboard from './pages/dashboard/CitizenDashboard';
import VolunteerDashboard from './pages/dashboard/VolunteerDashboard';
import AdminDashboard from './pages/dashboard/AdminDashboard';

// ─── Request Pages ────────────────────────────────────────────────────────────
import RequestsPage from './pages/requests/RequestsPage';
import CreateRequestPage from './pages/requests/CreateRequestPage';
import RequestDetailsPage from './pages/requests/RequestDetailsPage';
import EditRequestPage from './pages/requests/EditRequestPage';
import AvailableRequestsPage from './pages/requests/AvailableRequestsPage';

// ─── Assignment Pages ─────────────────────────────────────────────────────────
import AssignmentsPage from './pages/assignments/AssignmentsPage';
import AssignmentDetailsPage from './pages/assignments/AssignmentDetailsPage';

// ─── Notification Pages ───────────────────────────────────────────────────────
import NotificationsPage from './pages/notifications/NotificationsPage';

// ─── User Pages ───────────────────────────────────────────────────────────────
import ProfilePage from './pages/users/ProfilePage';
import SettingsPage from './pages/users/SettingsPage';
import MySkillsPage from './pages/users/MySkillsPage';

// ─── Landing ──────────────────────────────────────────────────────────────────
import LandingPage from './pages/LandingPage';

// ─── Admin Pages ──────────────────────────────────────────────────────────────
import AdminUsersPage from './pages/admin/AdminUsersPage';
import AdminRequestsPage from './pages/admin/AdminRequestsPage';
import AdminAssignmentsPage from './pages/admin/AdminAssignmentsPage';
import AdminSkillsPage from './pages/admin/AdminSkillsPage';
import AdminLocationsPage from './pages/admin/AdminLocationsPage';
import AdminAnalyticsPage from './pages/admin/AdminAnalyticsPage';
import AdminSettingsPage from './pages/admin/AdminSettingsPage';

// ─── New Feature Pages (lazy loaded) ─────────────────────────────────────────
const LeaderboardPage    = lazy(() => import('./pages/gamification/LeaderboardPage'));
const AchievementsPage   = lazy(() => import('./pages/gamification/AchievementsPage'));
const AvailabilityPage   = lazy(() => import('./pages/volunteer/AvailabilityPage'));
const BulletinBoardPage  = lazy(() => import('./pages/community/BulletinBoardPage'));
const AdminReportsPage   = lazy(() => import('./pages/admin/AdminReportsPage'));

// ─── Loading Fallback ─────────────────────────────────────────────────────────
const PageLoader: React.FC = () => (
  <div className="flex items-center justify-center py-20">
    <div className="w-8 h-8 border-2 border-primary-100 dark:border-primary-900/50 rounded-full relative">
      <div className="w-8 h-8 border-2 border-primary-600 border-t-transparent rounded-full animate-spin absolute inset-0" />
    </div>
  </div>
);

// ─── Query Client ─────────────────────────────────────────────────────────────
const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: 1, refetchOnWindowFocus: false },
  },
});

// ─── Protected Route ──────────────────────────────────────────────────────────
const ProtectedRoute: React.FC<{ children: React.ReactNode; requiredRole?: UserRole }> = ({ children, requiredRole }) => {
  const { isAuthenticated, user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="relative w-10 h-10">
          <div className="w-10 h-10 border-2 border-primary-100 dark:border-primary-900/50 rounded-full" />
          <div className="w-10 h-10 border-2 border-primary-600 border-t-transparent rounded-full animate-spin absolute inset-0" />
        </div>
      </div>
    );
  }

  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (requiredRole && user?.role !== requiredRole) return <Navigate to="/dashboard" replace />;

  return <>{children}</>;
};

// ─── Dashboard Router ─────────────────────────────────────────────────────────
const DashboardRouter: React.FC = () => {
  const { user } = useAuth();
  switch (user?.role) {
    case UserRole.ADMIN:     return <AdminDashboard />;
    case UserRole.VOLUNTEER: return <VolunteerDashboard />;
    case UserRole.CITIZEN:   return <CitizenDashboard />;
    default:                 return <Navigate to="/login" replace />;
  }
};

// ─── Global Confetti (connected to Gamification context) ──────────────────────
const GlobalConfetti: React.FC = () => {
  const { showConfetti } = useGamification();
  return <ConfettiEffect active={showConfetti} />;
};

// ─── Page Transition Wrapper ──────────────────────────────────────────────────
const AnimatedRoutes: React.FC = () => {
  const location = useLocation();
  return (
    <div key={location.pathname} className="animate-fade-in">
      <Suspense fallback={<PageLoader />}>
        <Routes location={location}>
          <Route path="/" element={<Layout />}>
            {/* Public */}
            <Route path="/login"          element={<LoginPage />} />
            <Route path="/register"       element={<RegisterPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/reset-password" element={<ResetPasswordPage />} />
            <Route path="/verify-email"   element={<EmailVerificationPage />} />
            <Route path="/2fa-setup"      element={<TwoFactorSetupPage />} />
            <Route path="/2fa-verify"     element={<TwoFactorVerifyPage />} />

            {/* Dashboard */}
            <Route path="/dashboard" element={<ProtectedRoute><DashboardRouter /></ProtectedRoute>} />

            {/* Profile & Settings */}
            <Route path="/profile"  element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
            <Route path="/settings" element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />
            <Route path="/skills"   element={<ProtectedRoute requiredRole={UserRole.VOLUNTEER}><MySkillsPage /></ProtectedRoute>} />

            {/* Notifications */}
            <Route path="/notifications" element={<ProtectedRoute><NotificationsPage /></ProtectedRoute>} />

            {/* Citizen Routes */}
            <Route path="/requests"        element={<ProtectedRoute requiredRole={UserRole.CITIZEN}><RequestsPage /></ProtectedRoute>} />
            <Route path="/requests/create" element={<ProtectedRoute requiredRole={UserRole.CITIZEN}><CreateRequestPage /></ProtectedRoute>} />
            <Route path="/requests/:id"    element={<ProtectedRoute><RequestDetailsPage /></ProtectedRoute>} />
            <Route path="/requests/:id/edit" element={<ProtectedRoute requiredRole={UserRole.CITIZEN}><EditRequestPage /></ProtectedRoute>} />

            {/* Volunteer Routes */}
            <Route path="/requests/available" element={<ProtectedRoute requiredRole={UserRole.VOLUNTEER}><AvailableRequestsPage /></ProtectedRoute>} />
            <Route path="/assignments"        element={<ProtectedRoute requiredRole={UserRole.VOLUNTEER}><AssignmentsPage /></ProtectedRoute>} />
            <Route path="/assignments/:id"    element={<ProtectedRoute requiredRole={UserRole.VOLUNTEER}><AssignmentDetailsPage /></ProtectedRoute>} />
            <Route path="/volunteer/availability" element={<ProtectedRoute requiredRole={UserRole.VOLUNTEER}><AvailabilityPage /></ProtectedRoute>} />
            <Route path="/achievements"       element={<ProtectedRoute requiredRole={UserRole.VOLUNTEER}><AchievementsPage /></ProtectedRoute>} />

            {/* Community (all authenticated) */}
            <Route path="/leaderboard"       element={<ProtectedRoute><LeaderboardPage /></ProtectedRoute>} />
            <Route path="/community/bulletin" element={<ProtectedRoute><BulletinBoardPage /></ProtectedRoute>} />

            {/* Admin Routes */}
            <Route path="/admin/users"       element={<ProtectedRoute requiredRole={UserRole.ADMIN}><AdminUsersPage /></ProtectedRoute>} />
            <Route path="/admin/requests"    element={<ProtectedRoute requiredRole={UserRole.ADMIN}><AdminRequestsPage /></ProtectedRoute>} />
            <Route path="/admin/assignments" element={<ProtectedRoute requiredRole={UserRole.ADMIN}><AdminAssignmentsPage /></ProtectedRoute>} />
            <Route path="/admin/skills"      element={<ProtectedRoute requiredRole={UserRole.ADMIN}><AdminSkillsPage /></ProtectedRoute>} />
            <Route path="/admin/locations"   element={<ProtectedRoute requiredRole={UserRole.ADMIN}><AdminLocationsPage /></ProtectedRoute>} />
            <Route path="/admin/analytics"   element={<ProtectedRoute requiredRole={UserRole.ADMIN}><AdminAnalyticsPage /></ProtectedRoute>} />
            <Route path="/admin/settings"    element={<ProtectedRoute requiredRole={UserRole.ADMIN}><AdminSettingsPage /></ProtectedRoute>} />
            <Route path="/admin/reports"     element={<ProtectedRoute requiredRole={UserRole.ADMIN}><AdminReportsPage /></ProtectedRoute>} />

            {/* Landing & misc */}
            <Route path="/"     element={<LandingPage />} />
            <Route path="/home" element={<Navigate to="/dashboard" replace />} />
          </Route>
        </Routes>
      </Suspense>
    </div>
  );
};

// ─── App ──────────────────────────────────────────────────────────────────────
function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <LanguageProvider>
          <TranslationSync>
            <AuthProvider>
              <GamificationProvider>
                <Router>
                  <WebSocketProvider>
                    <div className="App">
                      <AnimatedRoutes />
                      <GlobalConfetti />
                      <Toaster
                        position="top-right"
                        toastOptions={{
                          duration: 4000,
                          style: {
                            borderRadius: '12px',
                            background: 'var(--toast-bg, #fff)',
                            color: 'var(--toast-text, #111827)',
                            boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
                            fontSize: '14px',
                            fontWeight: 500,
                            padding: '12px 16px',
                          },
                          success: { iconTheme: { primary: '#000000', secondary: '#fff' } },
                          error:   { iconTheme: { primary: '#333333', secondary: '#fff' } },
                        }}
                      />
                    </div>
                  </WebSocketProvider>
                </Router>
              </GamificationProvider>
            </AuthProvider>
          </TranslationSync>
        </LanguageProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
