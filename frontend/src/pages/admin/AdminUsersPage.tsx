import React, { useState, useEffect } from 'react';
import { Users, Search, UserPlus, Edit, Trash2, MapPin, Award, Eye } from 'lucide-react';
import { usersApi } from '../../services/api';
import type { User } from '../../types';
import { UserRole } from '../../types';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import EmptyState from '../../components/common/EmptyState';
import Modal from '../../components/common/Modal';
import Input from '../../components/common/Input';

const AdminUsersPage: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('ALL');
  const [stats, setStats] = useState({
    totalUsers: 0,
    volunteers: 0,
    citizens: 0,
    admins: 0,
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phoneNumber: '',
    role: UserRole.CITIZEN,
    province: 'Kigali City',
    district: 'Gasabo',
    sector: '',
    cell: '',
    village: ''
  });

  // Mock data for demonstration
  const mockUsers: User[] = [
    {
      userId: 1,
      name: 'Admin User',
      email: 'admin@community.rw',
      phoneNumber: '+250788123456',
      role: UserRole.ADMIN,
      createdAt: '2024-01-01T00:00:00Z',
      location: {
        locationId: 1,
        province: 'Kigali City',
        district: 'Gasabo',
        provinceCode: 'KG01'
      },
      sector: 'Kimironko',
      cell: 'Bibare',
      village: 'Kamatamu'
    },
    {
      userId: 2,
      name: 'John Volunteer',
      email: 'volunteer@community.rw',
      phoneNumber: '+250788654321',
      role: UserRole.VOLUNTEER,
      createdAt: '2024-01-15T00:00:00Z',
      location: {
        locationId: 2,
        province: 'Eastern Province',
        district: 'Nyagatare',
        provinceCode: 'EP01'
      },
      sector: 'Nyagatare',
      cell: 'Rwempasha',
      village: 'Karama',
      skills: [
        { skillId: 1, skillName: 'Programming', description: 'Software development' },
        { skillId: 2, skillName: 'Tutoring', description: 'Academic support' }
      ]
    },
    {
      userId: 3,
      name: 'Jane Citizen',
      email: 'citizen@community.rw',
      phoneNumber: '+250788987654',
      role: UserRole.CITIZEN,
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
    },
    {
      userId: 4,
      name: 'Marie Claire Uwimana',
      email: 'marie.uwimana@email.rw',
      phoneNumber: '+250788111222',
      role: UserRole.VOLUNTEER,
      createdAt: '2024-02-15T00:00:00Z',
      location: {
        locationId: 1,
        province: 'Kigali City',
        district: 'Kicukiro',
        provinceCode: 'KG02'
      },
      sector: 'Niboye',
      cell: 'Kagarama',
      village: 'Kabuga',
      skills: [
        { skillId: 3, skillName: 'Healthcare', description: 'Medical assistance' },
        { skillId: 4, skillName: 'Cooking', description: 'Food preparation' }
      ]
    },
    {
      userId: 5,
      name: 'Jean Baptiste Nzeyimana',
      email: 'jean.nzeyimana@email.rw',
      phoneNumber: '+250788333444',
      role: UserRole.CITIZEN,
      createdAt: '2024-03-01T00:00:00Z',
      location: {
        locationId: 4,
        province: 'Western Province',
        district: 'Rubavu',
        provinceCode: 'WP02'
      },
      sector: 'Gisenyi',
      cell: 'Rubavu',
      village: 'Mahoko'
    }
  ];

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setIsLoading(true);
        // Try to fetch from API, fallback to mock data
        try {
          const response = await usersApi.getAll();
          setUsers(response.data.content || response.data);
        } catch (error) {
          // Use mock data if API fails
          setUsers(mockUsers);
        }
      } catch (error) {
        console.error('Failed to fetch users:', error);
        setUsers(mockUsers);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, []);

  useEffect(() => {
    let filtered = users;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(user => 
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by role
    if (roleFilter !== 'ALL') {
      filtered = filtered.filter(user => user.role === roleFilter);
    }

    setFilteredUsers(filtered);

    // Update stats
    setStats({
      totalUsers: users.length,
      volunteers: users.filter(u => u.role === UserRole.VOLUNTEER).length,
      citizens: users.filter(u => u.role === UserRole.CITIZEN).length,
      admins: users.filter(u => u.role === UserRole.ADMIN).length,
    });
  }, [users, searchTerm, roleFilter]);

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case UserRole.ADMIN:
        return 'danger';
      case UserRole.VOLUNTEER:
        return 'success';
      case UserRole.CITIZEN:
        return 'info';
      default:
        return 'gray';
    }
  };

  const handleAddUser = () => {
    setEditingUser(null);
    setFormData({
      name: '',
      email: '',
      phoneNumber: '',
      role: UserRole.CITIZEN,
      province: 'Kigali City',
      district: 'Gasabo',
      sector: '',
      cell: '',
      village: ''
    });
    setIsModalOpen(true);
  };

  const handleViewUser = (user: User) => {
    setSelectedUser(user);
    setIsViewModalOpen(true);
  };

  const handleEditUser = (user: User) => {
    setEditingUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      phoneNumber: user.phoneNumber,
      role: user.role,
      province: user.location.province,
      district: user.location.district,
      sector: user.sector || '',
      cell: user.cell || '',
      village: user.village || ''
    });
    setIsModalOpen(true);
  };

  const handleSaveUser = async () => {
    try {
      if (editingUser) {
        const updatedUser = {
          ...editingUser,
          ...formData,
          location: {
            ...editingUser.location,
            province: formData.province,
            district: formData.district
          }
        };
        setUsers(prev => prev.map(u => u.userId === editingUser.userId ? updatedUser : u));
      } else {
        const newUser: User = {
          userId: Math.max(...users.map(u => u.userId)) + 1,
          ...formData,
          createdAt: new Date().toISOString(),
          location: {
            locationId: Math.floor(Math.random() * 30) + 1,
            province: formData.province,
            district: formData.district,
            provinceCode: 'KG01'
          }
        };
        setUsers(prev => [...prev, newUser]);
      }
      setIsModalOpen(false);
    } catch (error) {
      console.error('Failed to save user:', error);
    }
  };

  const handleDeleteUser = async (userId: number) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        setUsers(prev => prev.filter(u => u.userId !== userId));
      } catch (error) {
        console.error('Failed to delete user:', error);
      }
    }
  };

  if (isLoading) {
    return <LoadingSpinner size="lg" text="Loading users..." />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
          <p className="text-gray-600 mt-1">Manage all system users and their roles</p>
        </div>
        <Button icon={UserPlus} onClick={handleAddUser}>
          Add New User
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <div className="flex items-center">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Users className="w-5 h-5 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Users</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalUsers}</p>
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <Award className="w-5 h-5 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Volunteers</p>
              <p className="text-2xl font-bold text-gray-900">{stats.volunteers}</p>
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Users className="w-5 h-5 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Citizens</p>
              <p className="text-2xl font-bold text-gray-900">{stats.citizens}</p>
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center">
            <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
              <Users className="w-5 h-5 text-red-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Admins</p>
              <p className="text-2xl font-bold text-gray-900">{stats.admins}</p>
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
                placeholder="Search users by name or email..."
                className="input-field pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <div className="sm:w-48">
            <select
              className="input-field"
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
            >
              <option value="ALL">All Roles</option>
              <option value={UserRole.ADMIN}>Admins</option>
              <option value={UserRole.VOLUNTEER}>Volunteers</option>
              <option value={UserRole.CITIZEN}>Citizens</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Users List */}
      <Card padding="none">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">
            Users ({filteredUsers.length})
          </h2>
        </div>
        <div className="p-6">
          {filteredUsers.length === 0 ? (
            <EmptyState
              icon={Users}
              title="No users found"
              description="No users match your current filters"
            />
          ) : (
            <div className="space-y-4">
              {filteredUsers.map((user) => (
                <div
                  key={user.userId}
                  className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                      <Users className="w-6 h-6 text-gray-600" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-3">
                        <h3 className="font-medium text-gray-900">{user.name}</h3>
                        <Badge variant={getRoleBadgeVariant(user.role)}>
                          {user.role}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-500">{user.email}</p>
                      <div className="flex items-center text-xs text-gray-400 mt-1">
                        <MapPin className="w-3 h-3 mr-1" />
                        {user.location.district}, {user.location.province}
                        {user.skills && user.skills.length > 0 && (
                          <>
                            <span className="mx-2">•</span>
                            <Award className="w-3 h-3 mr-1" />
                            {user.skills.length} skills
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button size="sm" variant="secondary" icon={Eye} onClick={() => handleViewUser(user)}>
                      View
                    </Button>
                    <Button size="sm" variant="secondary" icon={Edit} onClick={() => handleEditUser(user)}>
                      Edit
                    </Button>
                    <Button size="sm" variant="danger" icon={Trash2} onClick={() => handleDeleteUser(user.userId)}>
                      Delete
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </Card>

      {/* Add/Edit User Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingUser ? 'Edit User' : 'Add New User'}
        size="lg"
      >
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Full Name"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Enter full name"
              required
            />
            <Input
              label="Email Address"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
              placeholder="Enter email address"
              required
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Phone Number"
              value={formData.phoneNumber}
              onChange={(e) => setFormData(prev => ({ ...prev, phoneNumber: e.target.value }))}
              placeholder="+250788123456"
              required
            />
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Role <span className="text-red-500">*</span>
              </label>
              <select
                className="input-field"
                value={formData.role}
                onChange={(e) => setFormData(prev => ({ ...prev, role: e.target.value as UserRole }))}
                required
              >
                <option value={UserRole.CITIZEN}>Citizen</option>
                <option value={UserRole.VOLUNTEER}>Volunteer</option>
                <option value={UserRole.ADMIN}>Admin</option>
              </select>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Province <span className="text-red-500">*</span>
              </label>
              <select
                className="input-field"
                value={formData.province}
                onChange={(e) => setFormData(prev => ({ ...prev, province: e.target.value }))}
                required
              >
                <option value="Kigali City">Kigali City</option>
                <option value="Eastern Province">Eastern Province</option>
                <option value="Western Province">Western Province</option>
                <option value="Southern Province">Southern Province</option>
                <option value="Northern Province">Northern Province</option>
              </select>
            </div>
            <Input
              label="District"
              value={formData.district}
              onChange={(e) => setFormData(prev => ({ ...prev, district: e.target.value }))}
              placeholder="Enter district"
              required
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input
              label="Sector"
              value={formData.sector}
              onChange={(e) => setFormData(prev => ({ ...prev, sector: e.target.value }))}
              placeholder="Enter sector"
            />
            <Input
              label="Cell"
              value={formData.cell}
              onChange={(e) => setFormData(prev => ({ ...prev, cell: e.target.value }))}
              placeholder="Enter cell"
            />
            <Input
              label="Village"
              value={formData.village}
              onChange={(e) => setFormData(prev => ({ ...prev, village: e.target.value }))}
              placeholder="Enter village"
            />
          </div>
          
          <div className="flex justify-end space-x-3 pt-4">
            <Button
              variant="secondary"
              onClick={() => setIsModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSaveUser}
              disabled={!formData.name.trim() || !formData.email.trim() || !formData.phoneNumber.trim()}
            >
              {editingUser ? 'Update' : 'Create'} User
            </Button>
          </div>
        </div>
      </Modal>

      {/* View User Modal */}
      {selectedUser && (
        <Modal
          isOpen={isViewModalOpen}
          onClose={() => setIsViewModalOpen(false)}
          title="User Details"
          size="lg"
        >
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                <Users className="w-8 h-8 text-gray-600" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900">{selectedUser.name}</h3>
                <div className="flex items-center space-x-2 mt-1">
                  <Badge variant={getRoleBadgeVariant(selectedUser.role)}>
                    {selectedUser.role}
                  </Badge>
                  <span className="text-sm text-gray-500">
                    Joined: {new Date(selectedUser.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Contact Information</h4>
                <div className="bg-gray-50 p-3 rounded-lg space-y-2">
                  <p><span className="font-medium">Email:</span> {selectedUser.email}</p>
                  <p><span className="font-medium">Phone:</span> {selectedUser.phoneNumber}</p>
                </div>
              </div>
              
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Location</h4>
                <div className="bg-gray-50 p-3 rounded-lg space-y-2">
                  <p><span className="font-medium">Province:</span> {selectedUser.location.province}</p>
                  <p><span className="font-medium">District:</span> {selectedUser.location.district}</p>
                  {selectedUser.sector && <p><span className="font-medium">Sector:</span> {selectedUser.sector}</p>}
                  {selectedUser.cell && <p><span className="font-medium">Cell:</span> {selectedUser.cell}</p>}
                  {selectedUser.village && <p><span className="font-medium">Village:</span> {selectedUser.village}</p>}
                </div>
              </div>
            </div>
            
            {selectedUser.skills && selectedUser.skills.length > 0 && (
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Skills</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedUser.skills.map(skill => (
                    <span key={skill.skillId} className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                      {skill.skillName}
                    </span>
                  ))}
                </div>
              </div>
            )}
            
            <div className="flex justify-end space-x-3 pt-4">
              <Button variant="secondary" onClick={() => setIsViewModalOpen(false)}>
                Close
              </Button>
              <Button onClick={() => {
                setIsViewModalOpen(false);
                handleEditUser(selectedUser);
              }} icon={Edit}>
                Edit User
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default AdminUsersPage;