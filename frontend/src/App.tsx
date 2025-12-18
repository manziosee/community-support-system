import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Layout from './components/layout/Layout';
import { UserRole } from './types';

// Auth Pages
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage';
import ResetPasswordPage from './pages/auth/ResetPasswordPage';
import TwoFactorSetupPage from './pages/auth/TwoFactorSetupPage';
import TwoFactorVerifyPage from './pages/auth/TwoFactorVerifyPage';
import EmailVerificationPage from './pages/auth/EmailVerificationPage';

// Dashboard Pages
import CitizenDashboard from './pages/dashboard/CitizenDashboard';
import VolunteerDashboard from './pages/dashboard/VolunteerDashboard';
import AdminDashboard from './pages/dashboard/AdminDashboard';

// Request Pages
import RequestsPage from './pages/requests/RequestsPage';
import CreateRequestPage from './pages/requests/CreateRequestPage';
import RequestDetailsPage from './pages/requests/RequestDetailsPage';
import EditRequestPage from './pages/requests/EditRequestPage';
import AvailableRequestsPage from './pages/requests/AvailableRequestsPage';

// Assignment Pages
import AssignmentsPage from './pages/assignments/AssignmentsPage';
import AssignmentDetailsPage from './pages/assignments/AssignmentDetailsPage';

// Notification Pages
import NotificationsPage from './pages/notifications/NotificationsPage';

// User Pages
import ProfilePage from './pages/users/ProfilePage';
import SettingsPage from './pages/users/SettingsPage';
import MySkillsPage from './pages/users/MySkillsPage';

// Landing Page
import LandingPage from './pages/LandingPage';

// Admin Pages
import AdminUsersPage from './pages/admin/AdminUsersPage';
import AdminRequestsPage from './pages/admin/AdminRequestsPage';
import AdminAssignmentsPage from './pages/admin/AdminAssignmentsPage';
import AdminSkillsPage from './pages/admin/AdminSkillsPage';
import AdminLocationsPage from './pages/admin/AdminLocationsPage';
import AdminAnalyticsPage from './pages/admin/AdminAnalyticsPage';
import AdminSettingsPage from './pages/admin/AdminSettingsPage';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

// Protected Route Component
const ProtectedRoute: React.FC<{
  children: React.ReactNode;
  requiredRole?: UserRole;
}> = ({ children, requiredRole }) => {
  const { isAuthenticated, user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && user?.role !== requiredRole) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};

// Dashboard Router Component
const DashboardRouter: React.FC = () => {
  const { user } = useAuth();

  switch (user?.role) {
    case UserRole.ADMIN:
      return <AdminDashboard />;
    case UserRole.VOLUNTEER:
      return <VolunteerDashboard />;
    case UserRole.CITIZEN:
      return <CitizenDashboard />;
    default:
      return <Navigate to="/login" replace />;
  }
};

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router>
          <div className="App">
            <Routes>
              <Route path="/" element={<Layout />}>
                {/* Public Routes */}
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                <Route path="/reset-password" element={<ResetPasswordPage />} />
                <Route path="/verify-email" element={<EmailVerificationPage />} />
                <Route path="/2fa-setup" element={<TwoFactorSetupPage />} />
                <Route path="/2fa-verify" element={<TwoFactorVerifyPage />} />

                {/* Protected Routes */}
                <Route
                  path="/dashboard"
                  element={
                    <ProtectedRoute>
                      <DashboardRouter />
                    </ProtectedRoute>
                  }
                />

                {/* Profile & Settings */}
                <Route
                  path="/profile"
                  element={
                    <ProtectedRoute>
                      <ProfilePage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/settings"
                  element={
                    <ProtectedRoute>
                      <SettingsPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/skills"
                  element={
                    <ProtectedRoute requiredRole={UserRole.VOLUNTEER}>
                      <MySkillsPage />
                    </ProtectedRoute>
                  }
                />

                {/* Notifications */}
                <Route
                  path="/notifications"
                  element={
                    <ProtectedRoute>
                      <NotificationsPage />
                    </ProtectedRoute>
                  }
                />

                {/* Citizen Routes */}
                <Route
                  path="/requests"
                  element={
                    <ProtectedRoute requiredRole={UserRole.CITIZEN}>
                      <RequestsPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/requests/create"
                  element={
                    <ProtectedRoute requiredRole={UserRole.CITIZEN}>
                      <CreateRequestPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/requests/:id"
                  element={
                    <ProtectedRoute>
                      <RequestDetailsPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/requests/:id/edit"
                  element={
                    <ProtectedRoute requiredRole={UserRole.CITIZEN}>
                      <EditRequestPage />
                    </ProtectedRoute>
                  }
                />

                {/* Volunteer Routes */}
                <Route
                  path="/requests/available"
                  element={
                    <ProtectedRoute requiredRole={UserRole.VOLUNTEER}>
                      <AvailableRequestsPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/assignments"
                  element={
                    <ProtectedRoute requiredRole={UserRole.VOLUNTEER}>
                      <AssignmentsPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/assignments/:id"
                  element={
                    <ProtectedRoute requiredRole={UserRole.VOLUNTEER}>
                      <AssignmentDetailsPage />
                    </ProtectedRoute>
                  }
                />

                {/* Admin Routes */}
                <Route
                  path="/admin/users"
                  element={
                    <ProtectedRoute requiredRole={UserRole.ADMIN}>
                      <AdminUsersPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/requests"
                  element={
                    <ProtectedRoute requiredRole={UserRole.ADMIN}>
                      <AdminRequestsPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/assignments"
                  element={
                    <ProtectedRoute requiredRole={UserRole.ADMIN}>
                      <AdminAssignmentsPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/skills"
                  element={
                    <ProtectedRoute requiredRole={UserRole.ADMIN}>
                      <AdminSkillsPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/locations"
                  element={
                    <ProtectedRoute requiredRole={UserRole.ADMIN}>
                      <AdminLocationsPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/analytics"
                  element={
                    <ProtectedRoute requiredRole={UserRole.ADMIN}>
                      <AdminAnalyticsPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/settings"
                  element={
                    <ProtectedRoute requiredRole={UserRole.ADMIN}>
                      <AdminSettingsPage />
                    </ProtectedRoute>
                  }
                />

                {/* Landing Page */}
                <Route path="/" element={<LandingPage />} />
                
                {/* Default redirect for authenticated users */}
                <Route path="/home" element={<Navigate to="/dashboard" replace />} />
              </Route>
            </Routes>
            <Toaster position="top-right" />
          </div>
        </Router>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;