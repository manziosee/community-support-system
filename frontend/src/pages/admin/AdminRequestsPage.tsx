import React, { useState, useEffect } from 'react';
import { FileText, Search, Eye, Edit, Trash2, Clock, CheckCircle, XCircle, MapPin, User } from 'lucide-react';
import { requestsApi } from '../../services/api';
import type { Request } from '../../types';
import { RequestStatus } from '../../types';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import EmptyState from '../../components/common/EmptyState';
import Modal from '../../components/common/Modal';
import Input from '../../components/common/Input';

const AdminRequestsPage: React.FC = () => {
  const [requests, setRequests] = useState<Request[]>([]);
  const [filteredRequests, setFilteredRequests] = useState<Request[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    accepted: 0,
    completed: 0,
    cancelled: 0,
  });
  const [selectedRequest, setSelectedRequest] = useState<Request | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingRequest, setEditingRequest] = useState<Request | null>(null);
  const [editFormData, setEditFormData] = useState({
    title: '',
    description: '',
    status: RequestStatus.PENDING
  });

  // Mock requests data
  const mockRequests: Request[] = [
    {
      requestId: 1,
      title: 'Grocery Shopping Assistance',
      description: 'Need help with weekly grocery shopping due to mobility issues',
      status: RequestStatus.PENDING,
      createdAt: '2024-03-15T10:00:00Z',
      citizen: {
        userId: 3,
        name: 'Jane Citizen',
        email: 'citizen@community.rw',
        phoneNumber: '+250788987654',
        role: 'CITIZEN' as any,
        createdAt: '2024-02-01T00:00:00Z',
        location: {
          locationId: 3,
          province: 'Southern Province',
          district: 'Huye',
          provinceCode: 'SP03'
        }
      }
    },
    {
      requestId: 2,
      title: 'Computer Setup Help',
      description: 'Need assistance setting up new computer and installing software',
      status: RequestStatus.ACCEPTED,
      createdAt: '2024-03-14T14:30:00Z',
      citizen: {
        userId: 5,
        name: 'Jean Baptiste Nzeyimana',
        email: 'jean.nzeyimana@email.rw',
        phoneNumber: '+250788333444',
        role: 'CITIZEN' as any,
        createdAt: '2024-03-01T00:00:00Z',
        location: {
          locationId: 4,
          province: 'Western Province',
          district: 'Rubavu',
          provinceCode: 'WP02'
        }
      }
    },
    {
      requestId: 3,
      title: 'Math Tutoring for High School',
      description: 'Looking for math tutor for Grade 12 student preparing for national exams',
      status: RequestStatus.COMPLETED,
      createdAt: '2024-03-10T09:15:00Z',
      citizen: {
        userId: 3,
        name: 'Jane Citizen',
        email: 'citizen@community.rw',
        phoneNumber: '+250788987654',
        role: 'CITIZEN' as any,
        createdAt: '2024-02-01T00:00:00Z',
        location: {
          locationId: 3,
          province: 'Southern Province',
          district: 'Huye',
          provinceCode: 'SP03'
        }
      }
    },
    {
      requestId: 4,
      title: 'Transportation to Hospital',
      description: 'Need ride to hospital for medical appointment',
      status: RequestStatus.PENDING,
      createdAt: '2024-03-15T08:45:00Z',
      citizen: {
        userId: 5,
        name: 'Jean Baptiste Nzeyimana',
        email: 'jean.nzeyimana@email.rw',
        phoneNumber: '+250788333444',
        role: 'CITIZEN' as any,
        createdAt: '2024-03-01T00:00:00Z',
        location: {
          locationId: 4,
          province: 'Western Province',
          district: 'Rubavu',
          provinceCode: 'WP02'
        }
      }
    }
  ];

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        setIsLoading(true);
        try {
          const response = await requestsApi.getAll();
          setRequests(response.data.content || response.data);
        } catch (error) {
          setRequests(mockRequests);
        }
      } catch (error) {
        console.error('Failed to fetch requests:', error);
        setRequests(mockRequests);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRequests();
  }, []);

  useEffect(() => {
    let filtered = requests;

    if (searchTerm) {
      filtered = filtered.filter(request => 
        request.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        request.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        request.citizen.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== 'ALL') {
      filtered = filtered.filter(request => request.status === statusFilter);
    }

    setFilteredRequests(filtered);

    setStats({
      total: requests.length,
      pending: requests.filter(r => r.status === RequestStatus.PENDING).length,
      accepted: requests.filter(r => r.status === RequestStatus.ACCEPTED).length,
      completed: requests.filter(r => r.status === RequestStatus.COMPLETED).length,
      cancelled: requests.filter(r => r.status === RequestStatus.CANCELLED).length,
    });
  }, [requests, searchTerm, statusFilter]);

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case RequestStatus.PENDING:
        return 'warning';
      case RequestStatus.ACCEPTED:
        return 'info';
      case RequestStatus.COMPLETED:
        return 'success';
      case RequestStatus.CANCELLED:
        return 'danger';
      default:
        return 'gray';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case RequestStatus.PENDING:
        return Clock;
      case RequestStatus.ACCEPTED:
        return FileText;
      case RequestStatus.COMPLETED:
        return CheckCircle;
      case RequestStatus.CANCELLED:
        return XCircle;
      default:
        return FileText;
    }
  };

  const handleViewRequest = (request: Request) => {
    setSelectedRequest(request);
    setIsViewModalOpen(true);
  };

  const handleEditRequest = (request: Request) => {
    setEditingRequest(request);
    setEditFormData({
      title: request.title,
      description: request.description,
      status: request.status
    });
    setIsEditModalOpen(true);
  };

  const handleSaveRequest = async () => {
    if (!editingRequest) return;
    try {
      const updatedRequest = { ...editingRequest, ...editFormData };
      setRequests(prev => prev.map(r => r.requestId === editingRequest.requestId ? updatedRequest : r));
      setIsEditModalOpen(false);
    } catch (error) {
      console.error('Failed to save request:', error);
    }
  };

  const handleDeleteRequest = async (requestId: number) => {
    if (window.confirm('Are you sure you want to delete this request?')) {
      try {
        setRequests(prev => prev.filter(r => r.requestId !== requestId));
      } catch (error) {
        console.error('Failed to delete request:', error);
      }
    }
  };

  if (isLoading) {
    return <LoadingSpinner size="lg" text="Loading requests..." />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Request Management</h1>
          <p className="text-gray-600 mt-1">Monitor and manage all community requests</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        <Card>
          <div className="flex items-center">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <FileText className="w-5 h-5 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center">
            <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
              <Clock className="w-5 h-5 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Pending</p>
              <p className="text-2xl font-bold text-gray-900">{stats.pending}</p>
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <FileText className="w-5 h-5 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Accepted</p>
              <p className="text-2xl font-bold text-gray-900">{stats.accepted}</p>
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
        <Card>
          <div className="flex items-center">
            <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
              <XCircle className="w-5 h-5 text-red-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Cancelled</p>
              <p className="text-2xl font-bold text-gray-900">{stats.cancelled}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search requests by title, description, or citizen name..."
                className="input-field pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <div className="sm:w-48">
            <select
              className="input-field"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="ALL">All Status</option>
              <option value={RequestStatus.PENDING}>Pending</option>
              <option value={RequestStatus.ACCEPTED}>Accepted</option>
              <option value={RequestStatus.COMPLETED}>Completed</option>
              <option value={RequestStatus.CANCELLED}>Cancelled</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Requests List */}
      <Card padding="none">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">
            Requests ({filteredRequests.length})
          </h2>
        </div>
        <div className="p-6">
          {filteredRequests.length === 0 ? (
            <EmptyState
              icon={FileText}
              title="No requests found"
              description="No requests match your current filters"
            />
          ) : (
            <div className="space-y-4">
              {filteredRequests.map((request) => {
                const StatusIcon = getStatusIcon(request.status);
                return (
                  <div
                    key={request.requestId}
                    className="border border-gray-200 rounded-lg p-6 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <StatusIcon className="w-5 h-5 text-gray-400" />
                          <h3 className="font-semibold text-gray-900">{request.title}</h3>
                          <Badge variant={getStatusBadgeVariant(request.status)}>
                            {request.status}
                          </Badge>
                        </div>
                        <p className="text-gray-600 mb-3">{request.description}</p>
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <div className="flex items-center">
                            <User className="w-4 h-4 mr-1" />
                            {request.citizen.name}
                          </div>
                          <div className="flex items-center">
                            <MapPin className="w-4 h-4 mr-1" />
                            {request.citizen.location.district}, {request.citizen.location.province}
                          </div>
                          <div>
                            Created: {new Date(request.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2 ml-4">
                        <Button size="sm" variant="secondary" icon={Eye} onClick={() => handleViewRequest(request)}>
                          View
                        </Button>
                        <Button size="sm" variant="secondary" icon={Edit} onClick={() => handleEditRequest(request)}>
                          Edit
                        </Button>
                        <Button size="sm" variant="danger" icon={Trash2} onClick={() => handleDeleteRequest(request.requestId)}>
                          Delete
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </Card>

      {/* View Request Modal */}
      {selectedRequest && (
        <Modal
          isOpen={isViewModalOpen}
          onClose={() => setIsViewModalOpen(false)}
          title="Request Details"
          size="lg"
        >
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{selectedRequest.title}</h3>
              <div className="flex items-center space-x-2 mb-4">
                <Badge variant={getStatusBadgeVariant(selectedRequest.status)}>
                  {selectedRequest.status}
                </Badge>
                <span className="text-sm text-gray-500">
                  Created: {new Date(selectedRequest.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
            
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Description</h4>
              <p className="text-gray-600">{selectedRequest.description}</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Citizen Information</h4>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="font-medium">{selectedRequest.citizen.name}</p>
                  <p className="text-sm text-gray-600">{selectedRequest.citizen.email}</p>
                  <p className="text-sm text-gray-600">{selectedRequest.citizen.phoneNumber}</p>
                </div>
              </div>
              
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Location</h4>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="font-medium">{selectedRequest.citizen.location.district}</p>
                  <p className="text-sm text-gray-600">{selectedRequest.citizen.location.province}</p>
                  <p className="text-sm text-gray-600">Code: {selectedRequest.citizen.location.provinceCode}</p>
                </div>
              </div>
            </div>
            
            <div className="flex justify-end space-x-3 pt-4">
              <Button
                variant="secondary"
                onClick={() => setIsViewModalOpen(false)}
              >
                Close
              </Button>
              <Button
                onClick={() => {
                  setIsViewModalOpen(false);
                  handleEditRequest(selectedRequest);
                }}
                icon={Edit}
              >
                Edit Request
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* Edit Request Modal */}
      {editingRequest && (
        <Modal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          title="Edit Request"
          size="lg"
        >
          <div className="space-y-4">
            <Input
              label="Request Title"
              value={editFormData.title}
              onChange={(e) => setEditFormData(prev => ({ ...prev, title: e.target.value }))}
              placeholder="Enter request title"
              required
            />
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                className="input-field"
                rows={4}
                value={editFormData.description}
                onChange={(e) => setEditFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Enter request description"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status <span className="text-red-500">*</span>
              </label>
              <select
                className="input-field"
                value={editFormData.status}
                onChange={(e) => setEditFormData(prev => ({ ...prev, status: e.target.value as RequestStatus }))}
                required
              >
                <option value={RequestStatus.PENDING}>Pending</option>
                <option value={RequestStatus.ACCEPTED}>Accepted</option>
                <option value={RequestStatus.COMPLETED}>Completed</option>
                <option value={RequestStatus.CANCELLED}>Cancelled</option>
              </select>
            </div>
            
            <div className="bg-gray-50 p-3 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-2">Citizen Information</h4>
              <p className="text-sm text-gray-600">
                <span className="font-medium">Name:</span> {editingRequest.citizen.name}
              </p>
              <p className="text-sm text-gray-600">
                <span className="font-medium">Location:</span> {editingRequest.citizen.location.district}, {editingRequest.citizen.location.province}
              </p>
            </div>
            
            <div className="flex justify-end space-x-3 pt-4">
              <Button variant="secondary" onClick={() => setIsEditModalOpen(false)}>
                Cancel
              </Button>
              <Button
                onClick={handleSaveRequest}
                disabled={!editFormData.title.trim() || !editFormData.description.trim()}
              >
                Update Request
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default AdminRequestsPage;