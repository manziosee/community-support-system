import React, { useState, useEffect } from 'react';
import { CheckSquare, Search, Eye, Edit, Trash2, Clock, CheckCircle, User, FileText, Award, Download } from 'lucide-react';
import { assignmentsApi } from '../../services/api';
import type { Assignment } from '../../types';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import EmptyState from '../../components/common/EmptyState';
import { exportToCSV } from '../../utils/exportUtils';
import Modal from '../../components/common/Modal';
import { useTranslation } from 'react-i18next';

const AdminAssignmentsPage: React.FC = () => {
  const { t } = useTranslation();
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [filteredAssignments, setFilteredAssignments] = useState<Assignment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    completed: 0,
  });
  const [selectedAssignment, setSelectedAssignment] = useState<Assignment | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingAssignment, setEditingAssignment] = useState<Assignment | null>(null);
  const [editFormData, setEditFormData] = useState({
    completedAt: '',
    notes: ''
  });

  // Mock assignments data
  const mockAssignments: Assignment[] = [
    {
      assignmentId: 1,
      acceptedAt: '2024-03-14T15:00:00Z',
      completedAt: '2024-03-15T10:30:00Z',
      volunteer: {
        userId: 2,
        name: 'John Volunteer',
        email: 'volunteer@community.rw',
        phoneNumber: '+250788654321',
        role: 'VOLUNTEER' as any,
        createdAt: '2024-01-15T00:00:00Z',
        location: {
          locationId: 2,
          province: 'Eastern Province',
          district: 'Nyagatare',
          provinceCode: 'EP01'
        },
        skills: [
          { skillId: 1, skillName: 'Programming', description: 'Software development' }
        ]
      },
      request: {
        requestId: 3,
        title: 'Math Tutoring for High School',
        description: 'Looking for math tutor for Grade 12 student',
        status: 'COMPLETED' as any,
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
      }
    },
    {
      assignmentId: 2,
      acceptedAt: '2024-03-14T16:00:00Z',
      volunteer: {
        userId: 4,
        name: 'Marie Claire Uwimana',
        email: 'marie.uwimana@email.rw',
        phoneNumber: '+250788111222',
        role: 'VOLUNTEER' as any,
        createdAt: '2024-02-15T00:00:00Z',
        location: {
          locationId: 1,
          province: 'Kigali City',
          district: 'Kicukiro',
          provinceCode: 'KG02'
        },
        skills: [
          { skillId: 3, skillName: 'Healthcare', description: 'Medical assistance' }
        ]
      },
      request: {
        requestId: 2,
        title: 'Computer Setup Help',
        description: 'Need assistance setting up new computer',
        status: 'ACCEPTED' as any,
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
      }
    },
    {
      assignmentId: 3,
      acceptedAt: '2024-03-15T09:00:00Z',
      volunteer: {
        userId: 2,
        name: 'John Volunteer',
        email: 'volunteer@community.rw',
        phoneNumber: '+250788654321',
        role: 'VOLUNTEER' as any,
        createdAt: '2024-01-15T00:00:00Z',
        location: {
          locationId: 2,
          province: 'Eastern Province',
          district: 'Nyagatare',
          provinceCode: 'EP01'
        },
        skills: [
          { skillId: 2, skillName: 'Tutoring', description: 'Academic support' }
        ]
      },
      request: {
        requestId: 1,
        title: 'Grocery Shopping Assistance',
        description: 'Need help with weekly grocery shopping',
        status: 'ACCEPTED' as any,
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
      }
    }
  ];

  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        setIsLoading(true);
        try {
          const response = await assignmentsApi.getAll();
          setAssignments(response.data);
        } catch (error) {
          setAssignments(mockAssignments);
        }
      } catch (error) {
        console.error('Failed to fetch assignments:', error);
        setAssignments(mockAssignments);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAssignments();
  }, []);

  useEffect(() => {
    let filtered = assignments;

    if (searchTerm) {
      filtered = filtered.filter(assignment => 
        assignment.request?.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        assignment.volunteer?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        assignment.request?.citizen?.name?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter === 'ACTIVE') {
      filtered = filtered.filter(assignment => !assignment.completedAt);
    } else if (statusFilter === 'COMPLETED') {
      filtered = filtered.filter(assignment => assignment.completedAt);
    }

    setFilteredAssignments(filtered);

    setStats({
      total: assignments.length,
      active: assignments.filter(a => !a.completedAt).length,
      completed: assignments.filter(a => a.completedAt).length,
    });
  }, [assignments, searchTerm, statusFilter]);

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

  const handleViewAssignment = (assignment: Assignment) => {
    setSelectedAssignment(assignment);
    setIsViewModalOpen(true);
  };

  const handleEditAssignment = (assignment: Assignment) => {
    setEditingAssignment(assignment);
    setEditFormData({
      completedAt: assignment.completedAt || '',
      notes: ''
    });
    setIsEditModalOpen(true);
  };

  const handleSaveAssignment = async () => {
    if (!editingAssignment) return;
    try {
      const updatedAssignment = {
        ...editingAssignment,
        completedAt: editFormData.completedAt || undefined
      };
      setAssignments(prev => prev.map(a => a.assignmentId === editingAssignment.assignmentId ? updatedAssignment : a));
      setIsEditModalOpen(false);
    } catch (error) {
      console.error('Failed to save assignment:', error);
    }
  };

  const handleCompleteAssignment = async (assignmentId: number) => {
    try {
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

  const handleDeleteAssignment = async (assignmentId: number) => {
    if (window.confirm(t('admin_assignments_delete_confirm'))) {
      try {
        setAssignments(prev => prev.filter(a => a.assignmentId !== assignmentId));
      } catch (error) {
        console.error('Failed to delete assignment:', error);
      }
    }
  };

  if (isLoading) {
    return <LoadingSpinner size="lg" text="Loading assignments..." />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white">Assignment Management</h1>
          <p className="text-sm text-neutral-500 dark:text-slate-400 mt-0.5">Monitor volunteer assignments and their progress</p>
        </div>
        <Button
          type="button"
          variant="export"
          icon={Download}
          onClick={() => {
            const rows = filteredAssignments.map((a) => ({
              ID: a.assignmentId,
              Request: a.request?.title ?? '',
              Volunteer: a.volunteer?.name ?? '',
              Citizen: a.request?.citizen?.name ?? '',
              Status: a.completedAt ? 'Completed' : 'Active',
              'Accepted At': new Date(a.acceptedAt).toLocaleDateString(),
              'Completed At': a.completedAt ? new Date(a.completedAt).toLocaleDateString() : '',
            }));
            exportToCSV(rows as Record<string, unknown>[], 'assignments');
          }}
          disabled={filteredAssignments.length === 0}
        >
          Export CSV
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-[#eff6ff] dark:bg-[#1e3a5f]/40 rounded-xl flex items-center justify-center flex-shrink-0">
              <CheckSquare className="w-5 h-5 text-[#2563eb]" />
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-500 dark:text-slate-400 uppercase tracking-wider">Total Assignments</p>
              <p className="text-2xl font-black text-gray-900 dark:text-slate-100">{stats.total}</p>
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-[#fffbeb] dark:bg-[#451a03]/40 rounded-xl flex items-center justify-center flex-shrink-0">
              <Clock className="w-5 h-5 text-[#d97706]" />
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-500 dark:text-slate-400 uppercase tracking-wider">Active</p>
              <p className="text-2xl font-black text-gray-900 dark:text-slate-100">{stats.active}</p>
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-[#f0fdf4] dark:bg-[#14532d]/40 rounded-xl flex items-center justify-center flex-shrink-0">
              <CheckCircle className="w-5 h-5 text-[#059669]" />
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-500 dark:text-slate-400 uppercase tracking-wider">Completed</p>
              <p className="text-2xl font-black text-gray-900 dark:text-slate-100">{stats.completed}</p>
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
                placeholder="Search by request title, volunteer, or citizen name..."
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
              <option value="ACTIVE">Active</option>
              <option value="COMPLETED">Completed</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Assignments List */}
      <Card padding="none">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">
            Assignments ({filteredAssignments.length})
          </h2>
        </div>
        <div className="p-6">
          {filteredAssignments.length === 0 ? (
            <EmptyState
              icon={CheckSquare}
              title={t('admin_assignments_no_assignments')}
              description="No assignments match your current filters"
            />
          ) : (
            <div className="space-y-4">
              {filteredAssignments.map((assignment) => (
                <div
                  key={assignment.assignmentId}
                  className="border border-gray-200 rounded-lg p-6 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                >
                  <div className="flex flex-col sm:flex-row sm:items-start gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        <FileText className="w-5 h-5 text-gray-400 flex-shrink-0" />
                        <h3 className="font-semibold text-gray-900 dark:text-slate-100">
                          {assignment.request?.title || 'Assignment'}
                        </h3>
                        <Badge variant={assignment.completedAt ? 'success' : 'warning'}>
                          {assignment.completedAt ? 'Completed' : 'Active'}
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                        <div>
                          <div className="flex items-center text-sm text-gray-600 mb-1">
                            <Award className="w-4 h-4 mr-2" />
                            <span className="font-medium">Volunteer:</span>
                          </div>
                          <p className="text-sm text-gray-900 ml-6">{assignment.volunteer?.name || 'Unknown Volunteer'}</p>
                          <p className="text-xs text-gray-500 ml-6">
                            {assignment.volunteer?.location?.district || 'N/A'}, {assignment.volunteer?.location?.province || 'N/A'}
                          </p>
                        </div>
                        
                        <div>
                          <div className="flex items-center text-sm text-gray-600 mb-1">
                            <User className="w-4 h-4 mr-2" />
                            <span className="font-medium">Citizen:</span>
                          </div>
                          <p className="text-sm text-gray-900 ml-6">{assignment.request?.citizen?.name || 'Unknown Citizen'}</p>
                          <p className="text-xs text-gray-500 ml-6">
                            {assignment.request?.citizen?.location?.district || 'N/A'}, {assignment.request?.citizen?.location?.province || 'N/A'}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500 dark:text-slate-400">
                        <div>
                          Accepted: {new Date(assignment.acceptedAt).toLocaleDateString()}
                        </div>
                        {assignment.completedAt && (
                          <div>
                            Completed: {new Date(assignment.completedAt).toLocaleDateString()}
                          </div>
                        )}
                        <div>
                          Duration: {calculateDuration(assignment.acceptedAt, assignment.completedAt)}
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-1.5 flex-shrink-0">
                      <Button size="sm" variant="view" icon={Eye} onClick={() => handleViewAssignment(assignment)}>
                        View
                      </Button>
                      <Button size="sm" variant="edit" icon={Edit} onClick={() => handleEditAssignment(assignment)}>
                        Edit
                      </Button>
                      <Button size="sm" variant="delete" icon={Trash2} onClick={() => handleDeleteAssignment(assignment.assignmentId)}>
                        Delete
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </Card>

      {/* View Assignment Modal */}
      {selectedAssignment && (
        <Modal
          isOpen={isViewModalOpen}
          onClose={() => setIsViewModalOpen(false)}
          title="Assignment Details"
          size="lg"
        >
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {selectedAssignment.request?.title || 'Assignment'}
              </h3>
              <div className="flex items-center space-x-2 mb-4">
                <Badge variant={selectedAssignment.completedAt ? 'success' : 'warning'}>
                  {selectedAssignment.completedAt ? 'Completed' : 'Active'}
                </Badge>
                <span className="text-sm text-gray-500">
                  Duration: {calculateDuration(selectedAssignment.acceptedAt, selectedAssignment.completedAt)}
                </span>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Volunteer</h4>
                <div className="bg-blue-50 p-3 rounded-lg">
                  <p className="font-medium">{selectedAssignment.volunteer?.name || 'Unknown Volunteer'}</p>
                  <p className="text-sm text-gray-600">{selectedAssignment.volunteer?.email || 'N/A'}</p>
                  <p className="text-sm text-gray-600">{selectedAssignment.volunteer?.phoneNumber || 'N/A'}</p>
                  <p className="text-sm text-gray-600">
                    {selectedAssignment.volunteer?.location?.district || 'N/A'}, {selectedAssignment.volunteer?.location?.province || 'N/A'}
                  </p>
                </div>
              </div>
              
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Citizen</h4>
                <div className="bg-green-50 p-3 rounded-lg">
                  <p className="font-medium">{selectedAssignment.request?.citizen?.name || 'Unknown Citizen'}</p>
                  <p className="text-sm text-gray-600">{selectedAssignment.request?.citizen?.email || 'N/A'}</p>
                  <p className="text-sm text-gray-600">{selectedAssignment.request?.citizen?.phoneNumber || 'N/A'}</p>
                  <p className="text-sm text-gray-600">
                    {selectedAssignment.request?.citizen?.location?.district || 'N/A'}, {selectedAssignment.request?.citizen?.location?.province || 'N/A'}
                  </p>
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="font-medium text-[#111827] dark:text-slate-100 mb-2">Request Description</h4>
              <p className="text-[#374151] dark:text-slate-300 bg-gray-50 dark:bg-slate-700/60 border border-gray-100 dark:border-slate-600/40 p-3 rounded-lg">
                {selectedAssignment.request?.description || 'No description available'}
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Timeline</h4>
                <div className="space-y-2">
                  <p className="text-sm">
                    <span className="font-medium">Accepted:</span> {new Date(selectedAssignment.acceptedAt).toLocaleString()}
                  </p>
                  {selectedAssignment.completedAt && (
                    <p className="text-sm">
                      <span className="font-medium">Completed:</span> {new Date(selectedAssignment.completedAt).toLocaleString()}
                    </p>
                  )}
                </div>
              </div>
              
              {selectedAssignment.volunteer?.skills && selectedAssignment.volunteer.skills.length > 0 && (
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Volunteer Skills</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedAssignment.volunteer.skills.map(skill => (
                      <span key={skill?.skillId || Math.random()} className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full">
                        {skill?.skillName || 'Unknown Skill'}
                      </span>
                    ))}
                  </div>
                </div>
              )}
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
                  handleEditAssignment(selectedAssignment);
                }}
                icon={Edit}
              >
                Edit Assignment
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* Edit Assignment Modal */}
      {editingAssignment && (
        <Modal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          title="Edit Assignment"
          size="lg"
        >
          <div className="space-y-4">
            <div className="bg-gray-50 dark:bg-slate-700/60 border border-gray-100 dark:border-slate-600/40 p-4 rounded-lg">
              <h4 className="font-medium text-[#111827] dark:text-slate-100 mb-2">Assignment Details</h4>
              <p className="text-sm text-[#374151] dark:text-slate-300 mb-1">
                <span className="font-medium">Request:</span> {editingAssignment.request?.title || 'Unknown Request'}
              </p>
              <p className="text-sm text-[#374151] dark:text-slate-300 mb-1">
                <span className="font-medium">Volunteer:</span> {editingAssignment.volunteer?.name || 'Unknown Volunteer'}
              </p>
              <p className="text-sm text-[#374151] dark:text-slate-300">
                <span className="font-medium">Accepted:</span> {new Date(editingAssignment.acceptedAt).toLocaleString()}
              </p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Completion Status
              </label>
              <div className="flex items-center space-x-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="status"
                    checked={!editFormData.completedAt}
                    onChange={() => setEditFormData(prev => ({ ...prev, completedAt: '' }))}
                    className="mr-2"
                  />
                  Active
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="status"
                    checked={!!editFormData.completedAt}
                    onChange={() => setEditFormData(prev => ({ ...prev, completedAt: new Date().toISOString() }))}
                    className="mr-2"
                  />
                  Completed
                </label>
              </div>
            </div>
            
            {editFormData.completedAt && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Completion Date & Time
                </label>
                <input
                  type="datetime-local"
                  className="input-field"
                  value={editFormData.completedAt ? new Date(editFormData.completedAt).toISOString().slice(0, 16) : ''}
                  onChange={(e) => setEditFormData(prev => ({ ...prev, completedAt: new Date(e.target.value).toISOString() }))}
                />
              </div>
            )}
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Notes (Optional)
              </label>
              <textarea
                className="input-field"
                rows={3}
                value={editFormData.notes}
                onChange={(e) => setEditFormData(prev => ({ ...prev, notes: e.target.value }))}
                placeholder="Add any notes about this assignment..."
              />
            </div>
            
            <div className="flex justify-end space-x-3 pt-4">
              <Button variant="secondary" onClick={() => setIsEditModalOpen(false)}>
                Cancel
              </Button>
              {!editingAssignment.completedAt && (
                <Button
                  variant="success"
                  onClick={() => {
                    handleCompleteAssignment(editingAssignment.assignmentId);
                    setIsEditModalOpen(false);
                  }}
                >
                  Mark Complete
                </Button>
              )}
              <Button onClick={handleSaveAssignment}>
                Update Assignment
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default AdminAssignmentsPage;