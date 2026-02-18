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
import {
  PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import { adminApi } from '../../services/api';
import type { DashboardStats } from '../../types';
import Card from '../../components/common/Card';
import StatCard from '../../components/common/StatCard';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Button from '../../components/common/Button';

interface ExtendedStats extends DashboardStats {
  completedAssignments?: number;
  totalSkills?: number;
  totalLocations?: number;
}

const COLORS = ['#0d9488', '#6366f1', '#f59e0b', '#ef4444', '#22c55e', '#8b5cf6'];

const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<ExtendedStats>({
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
    { title: 'Total Users', value: stats.totalUsers, icon: Users, color: 'blue', link: '/admin/users' },
    { title: 'Volunteers', value: stats.totalVolunteers, icon: Award, color: 'green', link: '/admin/users?role=VOLUNTEER' },
    { title: 'Citizens', value: stats.totalCitizens, icon: Users, color: 'purple', link: '/admin/users?role=CITIZEN' },
    { title: 'Total Requests', value: stats.totalRequests, icon: FileText, color: 'orange', link: '/admin/requests' },
    { title: 'Pending Requests', value: stats.pendingRequests, icon: FileText, color: 'yellow', link: '/admin/requests?status=PENDING' },
    { title: 'Completed Requests', value: stats.completedRequests, icon: CheckSquare, color: 'green', link: '/admin/requests?status=COMPLETED' },
    { title: 'Total Assignments', value: stats.totalAssignments, icon: CheckSquare, color: 'indigo', link: '/admin/assignments' },
  ];

  // Chart data derived from real stats
  const userRoleData = [
    { name: 'Volunteers', value: stats.totalVolunteers },
    { name: 'Citizens', value: stats.totalCitizens },
    { name: 'Admins', value: Math.max(0, stats.totalUsers - stats.totalVolunteers - stats.totalCitizens) },
  ].filter(d => d.value > 0);

  const acceptedRequests = Math.max(0, stats.totalRequests - stats.pendingRequests - stats.completedRequests);
  const requestStatusData = [
    { name: 'Pending', value: stats.pendingRequests },
    { name: 'Accepted', value: acceptedRequests },
    { name: 'Completed', value: stats.completedRequests },
  ].filter(d => d.value > 0);

  const completedAssignments = stats.completedAssignments ?? 0;
  const activeAssignments = stats.totalAssignments - completedAssignments;
  const overviewBarData = [
    { name: 'Users', Total: stats.totalUsers, Active: stats.totalVolunteers + stats.totalCitizens },
    { name: 'Requests', Total: stats.totalRequests, Active: stats.pendingRequests + acceptedRequests },
    { name: 'Assignments', Total: stats.totalAssignments, Active: activeAssignments > 0 ? activeAssignments : 0 },
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
            <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
            <p className="text-gray-600 mt-1">System overview and management</p>
          </div>
          <div className="flex space-x-3">
            <Link to="/admin/analytics">
              <Button variant="secondary" icon={TrendingUp}>View Analytics</Button>
            </Link>
            <Link to="/admin/settings">
              <Button>System Settings</Button>
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

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* User Distribution Pie Chart */}
        <Card>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">User Distribution</h3>
          {userRoleData.length > 0 ? (
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={userRoleData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={90}
                  paddingAngle={4}
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {userRoleData.map((_entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[250px] flex items-center justify-center text-gray-400">No user data yet</div>
          )}
        </Card>

        {/* Request Status Pie Chart */}
        <Card>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Request Status</h3>
          {requestStatusData.length > 0 ? (
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={requestStatusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={90}
                  paddingAngle={4}
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {requestStatusData.map((_entry, index) => (
                    <Cell key={`cell-${index}`} fill={['#f59e0b', '#6366f1', '#22c55e'][index]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[250px] flex items-center justify-center text-gray-400">No request data yet</div>
          )}
        </Card>

        {/* System Overview Bar Chart */}
        <Card>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">System Overview</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={overviewBarData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Legend />
              <Bar dataKey="Total" fill="#0d9488" radius={[4, 4, 0, 0]} />
              <Bar dataKey="Active" fill="#6366f1" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card>
          <div className="flex items-center mb-4">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Users className="w-5 h-5 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 ml-3">User Management</h3>
          </div>
          <div className="space-y-3">
            <Link to="/admin/users" className="block p-4 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all group">
              <p className="font-medium text-gray-900 group-hover:text-blue-700">View All Users</p>
              <p className="text-sm text-gray-500 mt-1">Manage user accounts and permissions</p>
            </Link>
            <Link to="/admin/users?role=VOLUNTEER" className="block p-4 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all group">
              <p className="font-medium text-gray-900 group-hover:text-blue-700">Volunteer Management</p>
              <p className="text-sm text-gray-500 mt-1">Manage volunteer accounts and skills</p>
            </Link>
          </div>
        </Card>

        <Card>
          <div className="flex items-center mb-4">
            <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
              <FileText className="w-5 h-5 text-orange-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 ml-3">Request Management</h3>
          </div>
          <div className="space-y-3">
            <Link to="/admin/requests" className="block p-4 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all group">
              <p className="font-medium text-gray-900 group-hover:text-blue-700">All Requests</p>
              <p className="text-sm text-gray-500 mt-1">Monitor and moderate requests</p>
            </Link>
            <Link to="/admin/requests?status=PENDING" className="block p-4 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all group">
              <p className="font-medium text-gray-900 group-hover:text-blue-700">Pending Requests</p>
              <p className="text-sm text-gray-500 mt-1">Review requests awaiting volunteers</p>
            </Link>
          </div>
        </Card>

        <Card>
          <div className="flex items-center mb-4">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <Activity className="w-5 h-5 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 ml-3">System Management</h3>
          </div>
          <div className="space-y-3">
            <Link to="/admin/skills" className="block p-4 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all group">
              <p className="font-medium text-gray-900 group-hover:text-blue-700">Skill Management</p>
              <p className="text-sm text-gray-500 mt-1">Manage volunteer skill categories</p>
            </Link>
            <Link to="/admin/locations" className="block p-4 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all group">
              <p className="font-medium text-gray-900 group-hover:text-blue-700">Location Management</p>
              <p className="text-sm text-gray-500 mt-1">Manage geographic data</p>
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
