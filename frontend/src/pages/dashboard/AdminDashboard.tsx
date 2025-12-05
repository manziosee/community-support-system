import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Users, 
  FileText, 
  CheckSquare, 
  TrendingUp,
  Award,
  Activity
} from 'lucide-react';
import { adminApi } from '../../services/api';
import type { DashboardStats } from '../../types';
import Card from '../../components/common/Card';
import StatCard from '../../components/common/StatCard';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Button from '../../components/common/Button';

const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    totalVolunteers: 0,
    totalCitizens: 0,
    totalRequests: 0,
    pendingRequests: 0,
    completedRequests: 0,
    totalAssignments: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        setIsLoading(true);
        const response = await adminApi.getDashboardStats();
        setStats(response.data);
      } catch (error) {
        console.error('Failed to fetch dashboard stats:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardStats();
  }, []);

  const statCards = [
    {
      title: 'Total Users',
      value: stats.totalUsers,
      icon: Users,
      color: 'blue',
      link: '/admin/users',
    },
    {
      title: 'Volunteers',
      value: stats.totalVolunteers,
      icon: Award,
      color: 'green',
      link: '/admin/users?role=VOLUNTEER',
    },
    {
      title: 'Citizens',
      value: stats.totalCitizens,
      icon: Users,
      color: 'purple',
      link: '/admin/users?role=CITIZEN',
    },
    {
      title: 'Total Requests',
      value: stats.totalRequests,
      icon: FileText,
      color: 'orange',
      link: '/admin/requests',
    },
    {
      title: 'Pending Requests',
      value: stats.pendingRequests,
      icon: FileText,
      color: 'yellow',
      link: '/admin/requests?status=PENDING',
    },
    {
      title: 'Completed Requests',
      value: stats.completedRequests,
      icon: CheckSquare,
      color: 'green',
      link: '/admin/requests?status=COMPLETED',
    },
    {
      title: 'Total Assignments',
      value: stats.totalAssignments,
      icon: CheckSquare,
      color: 'indigo',
      link: '/admin/assignments',
    },
    {
      title: 'System Health',
      value: '99.9%',
      icon: Activity,
      color: 'green',
      link: '/admin/settings',
    },
  ];

  if (isLoading) {
    return <LoadingSpinner size="lg" text="Loading admin dashboard..." />;
  }

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Admin Dashboard
            </h1>
            <p className="text-gray-600 mt-1">
              System overview and management
            </p>
          </div>
          <div className="flex space-x-3">
            <Link to="/admin/analytics">
              <Button variant="secondary" icon={TrendingUp}>
                View Analytics
              </Button>
            </Link>
            <Link to="/admin/settings">
              <Button>
                System Settings
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card, index) => (
          <StatCard
            key={index}
            title={card.title}
            value={card.value}
            icon={card.icon}
            color={card.color as any}
            link={card.link}
          />
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* User Management */}
        <Card>
          <div className="flex items-center mb-4">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Users className="w-5 h-5 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 ml-3">User Management</h3>
          </div>
          <div className="space-y-3">
            <Link
              to="/admin/users"
              className="block p-4 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all group"
            >
              <p className="font-medium text-gray-900 group-hover:text-blue-700">View All Users</p>
              <p className="text-sm text-gray-500 mt-1">Manage user accounts and permissions</p>
            </Link>
            <Link
              to="/admin/users?role=VOLUNTEER"
              className="block p-4 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all group"
            >
              <p className="font-medium text-gray-900 group-hover:text-blue-700">Volunteer Management</p>
              <p className="text-sm text-gray-500 mt-1">Manage volunteer accounts and skills</p>
            </Link>
          </div>
        </Card>

        {/* Request Management */}
        <Card>
          <div className="flex items-center mb-4">
            <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
              <FileText className="w-5 h-5 text-orange-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 ml-3">Request Management</h3>
          </div>
          <div className="space-y-3">
            <Link
              to="/admin/requests"
              className="block p-4 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all group"
            >
              <p className="font-medium text-gray-900 group-hover:text-blue-700">All Requests</p>
              <p className="text-sm text-gray-500 mt-1">Monitor and moderate requests</p>
            </Link>
            <Link
              to="/admin/requests?status=PENDING"
              className="block p-4 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all group"
            >
              <p className="font-medium text-gray-900 group-hover:text-blue-700">Pending Requests</p>
              <p className="text-sm text-gray-500 mt-1">Review requests awaiting volunteers</p>
            </Link>
          </div>
        </Card>

        {/* System Management */}
        <Card>
          <div className="flex items-center mb-4">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <Activity className="w-5 h-5 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 ml-3">System Management</h3>
          </div>
          <div className="space-y-3">
            <Link
              to="/admin/skills"
              className="block p-4 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all group"
            >
              <p className="font-medium text-gray-900 group-hover:text-blue-700">Skill Management</p>
              <p className="text-sm text-gray-500 mt-1">Manage volunteer skill categories</p>
            </Link>
            <Link
              to="/admin/locations"
              className="block p-4 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all group"
            >
              <p className="font-medium text-gray-900 group-hover:text-blue-700">Location Management</p>
              <p className="text-sm text-gray-500 mt-1">Manage geographic data</p>
            </Link>
          </div>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card padding="none">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Recent System Activity</h2>
        </div>
        <div className="p-6">
          <div className="space-y-3">
            <div className="flex items-start p-4 bg-green-50 rounded-lg border border-green-100">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <CheckSquare className="w-5 h-5 text-green-600" />
              </div>
              <div className="ml-4 flex-1">
                <p className="text-sm font-medium text-gray-900">Request completed</p>
                <p className="text-xs text-gray-600 mt-1">Grocery shopping assistance completed by Jean Baptiste</p>
                <span className="text-xs text-gray-500 mt-2 inline-block">2 minutes ago</span>
              </div>
            </div>
            <div className="flex items-start p-4 bg-blue-50 rounded-lg border border-blue-100">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <Users className="w-5 h-5 text-blue-600" />
              </div>
              <div className="ml-4 flex-1">
                <p className="text-sm font-medium text-gray-900">New volunteer registered</p>
                <p className="text-xs text-gray-600 mt-1">Marie Claire joined as a healthcare volunteer</p>
                <span className="text-xs text-gray-500 mt-2 inline-block">15 minutes ago</span>
              </div>
            </div>
            <div className="flex items-start p-4 bg-yellow-50 rounded-lg border border-yellow-100">
              <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <FileText className="w-5 h-5 text-yellow-600" />
              </div>
              <div className="ml-4 flex-1">
                <p className="text-sm font-medium text-gray-900">New request created</p>
                <p className="text-xs text-gray-600 mt-1">Computer setup assistance needed in Gasabo</p>
                <span className="text-xs text-gray-500 mt-2 inline-block">1 hour ago</span>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default AdminDashboard;