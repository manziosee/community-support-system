import React, { useState, useEffect } from 'react';
import { CheckSquare, Search, Filter, Clock, CheckCircle, User, MapPin, Phone, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { assignmentsApi } from '../../services/api';
import type { Assignment } from '../../types';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import EmptyState from '../../components/common/EmptyState';

const AssignmentsPage: React.FC = () => {
  const { user } = useAuth();
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [filteredAssignments, setFilteredAssignments] = useState<Assignment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    completed: 0
  });

  useEffect(() => {
    const fetchAssignments = async () => {
      if (!user) return;
      
      try {
        setIsLoading(true);
        const response = await assignmentsApi.getByVolunteer(user.userId);
        setAssignments(response.data);
      } catch (error) {
        console.error('Failed to fetch assignments:', error);
        setAssignments([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAssignments();
  }, [user]);

  useEffect(() => {
    let filtered = assignments;

    if (statusFilter === 'ACTIVE') {
      filtered = filtered.filter(assignment => !assignment.completedAt);
    } else if (statusFilter === 'COMPLETED') {
      filtered = filtered.filter(assignment => assignment.completedAt);
    }

    setFilteredAssignments(filtered);

    setStats({
      total: assignments.length,
      active: assignments.filter(a => !a.completedAt).length,
      completed: assignments.filter(a => a.completedAt).length
    });
  }, [assignments, statusFilter]);

  const handleCompleteAssignment = async (assignmentId: number) => {
    try {
      await assignmentsApi.complete(assignmentId);
      const now = new Date().toISOString();
      setAssignments(prev => prev.map(a => 
        a.assignmentId === assignmentId 
          ? { ...a, completedAt: now }
          : a
      ));
    } catch (error) {
      console.error('Failed to complete assignment:', error);
    }
  };

  const calculateDuration = (acceptedAt: string, completedAt?: string) => {
    const start = new Date(acceptedAt);
    const end = completedAt ? new Date(completedAt) : new Date();
    const diffInHours = Math.floor((end.getTime() - start.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 24) {
      return `${diffInHours}h`;
    } else {
      const days = Math.floor(diffInHours / 24);
      return `${days}d`;
    }
  };

  if (isLoading) {
    return <LoadingSpinner size="lg" text="Loading your assignments..." />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Assignments</h1>
          <p className="text-gray-600 mt-1">Track your volunteer work and help requests</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <div className="flex items-center">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <CheckSquare className="w-5 h-5 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Assignments</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center">
            <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
              <Clock className="w-5 h-5 text-orange-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Active</p>
              <p className="text-2xl font-bold text-gray-900">{stats.active}</p>
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Completed</p>
              <p className="text-2xl font-bold text-gray-900">{stats.completed}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Filter */}
      <Card>
        <div className="flex items-center space-x-4">
          <Filter className="w-4 h-4 text-gray-400" />
          <div className="flex space-x-2">
            <button
              onClick={() => setStatusFilter('ALL')}
              className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                statusFilter === 'ALL'
                  ? 'bg-blue-100 text-blue-800'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              All ({stats.total})
            </button>
            <button
              onClick={() => setStatusFilter('ACTIVE')}
              className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                statusFilter === 'ACTIVE'
                  ? 'bg-orange-100 text-orange-800'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Active ({stats.active})
            </button>
            <button
              onClick={() => setStatusFilter('COMPLETED')}
              className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                statusFilter === 'COMPLETED'
                  ? 'bg-green-100 text-green-800'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Completed ({stats.completed})
            </button>
          </div>
        </div>
      </Card>

      {/* Assignments List */}
      <div className="space-y-4">
        {filteredAssignments.length === 0 ? (
          <EmptyState
            icon={CheckSquare}
            title="No assignments found"
            description={`No ${statusFilter.toLowerCase()} assignments found`}
          />
        ) : (
          filteredAssignments.map((assignment) => (
            <Card key={assignment.assignmentId} hover>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <CheckSquare className="w-5 h-5 text-gray-400" />
                    <h3 className="font-semibold text-gray-900">
                      {assignment.request?.title || 'Assignment'}
                    </h3>
                    <Badge variant={assignment.completedAt ? 'success' : 'warning'}>
                      {assignment.completedAt ? 'Completed' : 'Active'}
                    </Badge>
                  </div>
                  
                  <p className="text-gray-600 mb-4">{assignment.request?.description}</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <h4 className="font-medium text-gray-900 mb-2">Citizen Contact</h4>
                      <div className="space-y-1 text-sm">
                        <div className="flex items-center">
                          <User className="w-4 h-4 mr-2 text-gray-400" />
                          {assignment.request?.citizen.name}
                        </div>
                        <div className="flex items-center">
                          <Phone className="w-4 h-4 mr-2 text-gray-400" />
                          {assignment.request?.citizen.phoneNumber}
                        </div>
                        <div className="flex items-center">
                          <MapPin className="w-4 h-4 mr-2 text-gray-400" />
                          {assignment.request?.citizen.location.district}, {assignment.request?.citizen.location.province}
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-blue-50 p-3 rounded-lg">
                      <h4 className="font-medium text-gray-900 mb-2">Timeline</h4>
                      <div className="space-y-1 text-sm">
                        <p>
                          <span className="font-medium">Accepted:</span> {new Date(assignment.acceptedAt).toLocaleDateString()}
                        </p>
                        {assignment.completedAt ? (
                          <p>
                            <span className="font-medium">Completed:</span> {new Date(assignment.completedAt).toLocaleDateString()}
                          </p>
                        ) : (
                          <p className="text-orange-600">
                            <span className="font-medium">Duration:</span> {calculateDuration(assignment.acceptedAt)}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="ml-6 flex space-x-2">
                  <Link to={`/assignments/${assignment.assignmentId}`}>
                    <Button variant="secondary" icon={Eye}>
                      View
                    </Button>
                  </Link>
                  {!assignment.completedAt && (
                    <Button
                      onClick={() => handleCompleteAssignment(assignment.assignmentId)}
                      icon={CheckCircle}
                      variant="success"
                    >
                      Complete
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default AssignmentsPage;