import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, FileText, User, MapPin, Calendar, Clock, Edit, Trash2 } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { requestsApi } from '../../services/api';
import type { Request } from '../../types';
import { RequestStatus } from '../../types';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const RequestDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [request, setRequest] = useState<Request | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchRequest = async () => {
      if (!id) return;

      try {
        setIsLoading(true);
        const response = await requestsApi.getById(parseInt(id));
        setRequest(response.data);
      } catch (error) {
        console.error('Failed to fetch request:', error);
        setRequest(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRequest();
  }, [id]);

  const handleDelete = async () => {
    if (!request || !window.confirm('Are you sure you want to delete this request?')) return;

    try {
      await requestsApi.delete(request.requestId);
      navigate('/requests');
    } catch (error) {
      console.error('Failed to delete request:', error);
    }
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case RequestStatus.PENDING:
        return 'warning';
      case RequestStatus.ACCEPTED:
        return 'info';
      case RequestStatus.COMPLETED:
        return 'success';
      default:
        return 'gray';
    }
  };

  if (isLoading) {
    return <LoadingSpinner size="lg" text="Loading request details..." />;
  }

  if (!request) {
    return (
      <div className="text-center py-12">
        <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Request not found</h2>
        <p className="text-gray-600 mb-4">The request you're looking for doesn't exist.</p>
        <Button onClick={() => navigate('/requests')}>
          Back to Requests
        </Button>
      </div>
    );
  }

  const isOwner = user?.userId === request.citizen.userId;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            variant="secondary"
            icon={ArrowLeft}
            onClick={() => navigate('/requests')}
          >
            Back to Requests
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Request Details</h1>
            <p className="text-gray-600">View and manage request information</p>
          </div>
        </div>
        {isOwner && request.status === RequestStatus.PENDING && (
          <div className="flex space-x-2">
            <Link to={`/requests/${request.requestId}/edit`}>
              <Button variant="secondary" icon={Edit}>
                Edit
              </Button>
            </Link>
            <Button variant="danger" icon={Trash2} onClick={handleDelete}>
              Delete
            </Button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Request Info */}
          <Card>
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <FileText className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">{request.title}</h2>
                  <Badge variant={getStatusBadgeVariant(request.status)}>
                    {request.status}
                  </Badge>
                </div>
              </div>
            </div>
            
            <div className="prose max-w-none">
              <h3 className="text-lg font-medium text-gray-900 mb-3">Description</h3>
              <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                {request.description}
              </p>
            </div>
          </Card>

          {/* Timeline */}
          <Card>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Request Timeline</h3>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                <div>
                  <p className="font-medium text-gray-900">Request Created</p>
                  <p className="text-sm text-gray-600">
                    {new Date(request.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>
              {request.status === RequestStatus.ACCEPTED && (
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                  <div>
                    <p className="font-medium text-gray-900">Request Accepted</p>
                    <p className="text-sm text-gray-600">A volunteer has accepted this request</p>
                  </div>
                </div>
              )}
              {request.status === RequestStatus.COMPLETED && (
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
                  <div>
                    <p className="font-medium text-gray-900">Request Completed</p>
                    <p className="text-sm text-gray-600">The help has been successfully provided</p>
                  </div>
                </div>
              )}
            </div>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Citizen Info */}
          <Card>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Citizen Information</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <User className="w-4 h-4 text-gray-400" />
                <div>
                  <p className="font-medium text-gray-900">
                    {request.citizen.name || `${request.citizen.firstName || ''} ${request.citizen.lastName || ''}`.trim() || 'Unknown User'}
                  </p>
                  <p className="text-sm text-gray-600">{request.citizen.email}</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <MapPin className="w-4 h-4 text-gray-400 mt-0.5" />
                <div>
                  <p className="font-medium text-gray-900">Location</p>
                  <p className="text-sm text-gray-600">
                    {request.citizen.location ? 
                      `${request.citizen.location.district}, ${request.citizen.location.province}` :
                      `${request.citizen.district || 'N/A'}, ${request.citizen.province || 'N/A'}`
                    }
                  </p>
                  {request.citizen.sector && (
                    <p className="text-sm text-gray-600">
                      Sector: {request.citizen.sector}
                    </p>
                  )}
                  {request.citizen.cell && (
                    <p className="text-sm text-gray-600">
                      Cell: {request.citizen.cell}
                    </p>
                  )}
                  {request.citizen.village && (
                    <p className="text-sm text-gray-600">
                      Village: {request.citizen.village}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </Card>

          {/* Request Stats */}
          <Card>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Request Details</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Status</span>
                <Badge variant={getStatusBadgeVariant(request.status)}>
                  {request.status}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Created</span>
                <span className="text-sm font-medium text-gray-900">
                  {new Date(request.createdAt).toLocaleDateString()}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Request ID</span>
                <span className="text-sm font-medium text-gray-900">
                  #{request.requestId}
                </span>
              </div>
            </div>
          </Card>

          {/* Actions */}
          {user?.role === 'VOLUNTEER' && request.status === RequestStatus.PENDING && (
            <Card>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Volunteer Actions</h3>
              <Button className="w-full">
                Accept Request
              </Button>
              <p className="text-xs text-gray-500 mt-2">
                By accepting, you commit to helping this citizen with their request.
              </p>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default RequestDetailsPage;