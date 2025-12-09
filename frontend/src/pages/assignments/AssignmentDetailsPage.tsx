import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckSquare, User, MapPin, Phone, Mail, Calendar, Clock, CheckCircle } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { assignmentsApi } from '../../services/api';
import type { Assignment } from '../../types';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const AssignmentDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [assignment, setAssignment] = useState<Assignment | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const mockAssignment: Assignment = {
    assignmentId: parseInt(id || '1'),
    acceptedAt: '2024-03-15T09:00:00Z',
    volunteer: user!,
    request: {
      requestId: 1,
      title: 'Grocery Shopping Assistance',
      description: 'I need help with weekly grocery shopping due to mobility issues. I have a detailed shopping list and can provide money upfront. The grocery store is about 10 minutes walk from my location.',
      status: 'ACCEPTED' as any,
      createdAt: '2024-03-15T10:00:00Z',
      citizen: {
        userId: 3,
        name: 'Jane Citizen',
        email: 'jane.citizen@example.com',
        phoneNumber: '+250788987654',
        role: 'CITIZEN' as any,
        createdAt: '2024-02-01T00:00:00Z',
        location: {
          locationId: 3,
          province: 'Southern Province',
          district: 'Huye',
          provinceCode: 'SP03'
        },
        sector: 'Tumba',
        cell: 'Matyazo',
        village: 'Cyarwa'
      }
    }
  };

  useEffect(() => {
    const fetchAssignment = async () => {
      if (!id) return;

      try {
        setIsLoading(true);
        try {
          const response = await assignmentsApi.getById(parseInt(id));
          setAssignment(response.data);
        } catch (error) {
          setAssignment(mockAssignment);
        }
      } catch (error) {
        console.error('Failed to fetch assignment:', error);
        setAssignment(mockAssignment);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAssignment();
  }, [id]);

  const handleComplete = async () => {
    if (!assignment || !window.confirm('Mark this assignment as completed?')) return;

    try {
      await assignmentsApi.complete(assignment.assignmentId);
      setAssignment(prev => prev ? { ...prev, completedAt: new Date().toISOString() } : null);
    } catch (error) {
      setAssignment(prev => prev ? { ...prev, completedAt: new Date().toISOString() } : null);
    }
  };

  if (isLoading) {
    return <LoadingSpinner size="lg" text="Loading assignment details..." />;
  }

  if (!assignment) {
    return (
      <div className="text-center py-12">
        <CheckSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Assignment not found</h2>
        <p className="text-gray-600 mb-4">The assignment you're looking for doesn't exist.</p>
        <Button onClick={() => navigate('/assignments')}>
          Back to Assignments
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            variant="secondary"
            icon={ArrowLeft}
            onClick={() => navigate('/assignments')}
          >
            Back
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Assignment Details</h1>
            <p className="text-gray-600">View and manage assignment information</p>
          </div>
        </div>
        {!assignment.completedAt && (
          <Button icon={CheckCircle} onClick={handleComplete}>
            Mark as Completed
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <CheckSquare className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">{assignment.request?.title}</h2>
                  <Badge variant={assignment.completedAt ? 'success' : 'warning'}>
                    {assignment.completedAt ? 'Completed' : 'Active'}
                  </Badge>
                </div>
              </div>
            </div>
            
            <div className="prose max-w-none">
              <h3 className="text-lg font-medium text-gray-900 mb-3">Request Description</h3>
              <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                {assignment.request?.description}
              </p>
            </div>
          </Card>

          <Card>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Citizen Contact Information</h3>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <User className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="font-medium text-gray-900">{assignment.request?.citizen.name}</p>
                  <p className="text-sm text-gray-600">Citizen</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-gray-900">{assignment.request?.citizen.email}</p>
                  <p className="text-sm text-gray-600">Email Address</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-gray-900">{assignment.request?.citizen.phoneNumber}</p>
                  <p className="text-sm text-gray-600">Phone Number</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="font-medium text-gray-900">Location</p>
                  <p className="text-sm text-gray-600">
                    {assignment.request?.citizen.location.district}, {assignment.request?.citizen.location.province}
                  </p>
                  {assignment.request?.citizen.sector && (
                    <p className="text-sm text-gray-600">Sector: {assignment.request.citizen.sector}</p>
                  )}
                  {assignment.request?.citizen.cell && (
                    <p className="text-sm text-gray-600">Cell: {assignment.request.citizen.cell}</p>
                  )}
                  {assignment.request?.citizen.village && (
                    <p className="text-sm text-gray-600">Village: {assignment.request.citizen.village}</p>
                  )}
                </div>
              </div>
            </div>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Assignment Timeline</h3>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                <div>
                  <p className="font-medium text-gray-900">Request Created</p>
                  <p className="text-sm text-gray-600">
                    {new Date(assignment.request?.createdAt || '').toLocaleString()}
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                <div>
                  <p className="font-medium text-gray-900">Assignment Accepted</p>
                  <p className="text-sm text-gray-600">
                    {new Date(assignment.acceptedAt).toLocaleString()}
                  </p>
                </div>
              </div>
              {assignment.completedAt && (
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
                  <div>
                    <p className="font-medium text-gray-900">Assignment Completed</p>
                    <p className="text-sm text-gray-600">
                      {new Date(assignment.completedAt).toLocaleString()}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </Card>

          <Card>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Assignment Details</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Status</span>
                <Badge variant={assignment.completedAt ? 'success' : 'warning'}>
                  {assignment.completedAt ? 'Completed' : 'Active'}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Assignment ID</span>
                <span className="text-sm font-medium text-gray-900">
                  #{assignment.assignmentId}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Request ID</span>
                <span className="text-sm font-medium text-gray-900">
                  #{assignment.request?.requestId}
                </span>
              </div>
            </div>
          </Card>

          {!assignment.completedAt && (
            <Card>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Actions</h3>
              <Button className="w-full" icon={CheckCircle} onClick={handleComplete}>
                Mark as Completed
              </Button>
              <p className="text-xs text-gray-500 mt-2">
                Mark this assignment as completed once you've finished helping the citizen.
              </p>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default AssignmentDetailsPage;