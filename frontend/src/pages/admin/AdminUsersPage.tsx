import React, { useState, useEffect } from 'react';
import { Users, Search, UserPlus, Edit, Trash2, MapPin, Award, Eye, Lock, Unlock, Key, Shield, ShieldOff } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { usersApi, adminApi, rwandaLocationsApi } from '../../services/api';
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
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState<number | null>(null);
  const [isTogglingLock, setIsTogglingLock] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  // Form data
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phoneNumber: '',
    role: UserRole.CITIZEN as UserRole,
    province: '',
    district: '',
    sector: '',
    cell: '',
    village: '',
    newPassword: '',
    confirmPassword: '',
  });

  // Rwanda API location states
  const [provinces, setProvinces] = useState<string[]>([]);
  const [districts, setDistricts] = useState<string[]>([]);
  const [sectors, setSectors] = useState<string[]>([]);
  const [cells, setCells] = useState<string[]>([]);
  const [villages, setVillages] = useState<string[]>([]);
  const [locationLoading, setLocationLoading] = useState(false);

  // Fetch users
  useEffect(() => {
    fetchUsers();
  }, [currentPage]);

  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      const response = await adminApi.getAllUsers(currentPage, 20);
      const data = response.data;
      if (data.content) {
        setUsers(data.content);
        setTotalPages(data.totalPages || 1);
      } else if (Array.isArray(data)) {
        setUsers(data);
        setTotalPages(1);
      }
    } catch (error) {
      console.error('Failed to fetch users:', error);
      // Fallback to users API
      try {
        const response = await usersApi.getAll(currentPage, 20);
        const data = response.data;
        if (data.content) {
          setUsers(data.content);
          setTotalPages(data.totalPages || 1);
        } else if (Array.isArray(data)) {
          setUsers(data);
          setTotalPages(1);
        }
      } catch {
        toast.error('Failed to load users');
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch provinces on mount
  useEffect(() => {
    const loadProvinces = async () => {
      try {
        const response = await rwandaLocationsApi.getProvinces();
        const provData = response.data?.data || response.data || [];
        setProvinces(Array.isArray(provData) ? provData : []);
      } catch (error) {
        console.error('Failed to fetch provinces:', error);
      }
    };
    loadProvinces();
  }, []);

  // Fetch districts when province changes
  useEffect(() => {
    const fetchDistricts = async () => {
      if (formData.province && formData.province !== '') {
        setLocationLoading(true);
        try {
          const response = await rwandaLocationsApi.getDistricts(formData.province);
          const distData = response.data?.data || response.data || [];
          setDistricts(Array.isArray(distData) ? distData : []);
        } catch (error) {
          console.error('Failed to fetch districts:', error);
          setDistricts([]);
        } finally {
          setLocationLoading(false);
        }
      } else {
        setDistricts([]);
      }
      setSectors([]);
      setCells([]);
      setVillages([]);
    };
    fetchDistricts();
  }, [formData.province]);

  // Fetch sectors when district changes
  useEffect(() => {
    const fetchSectors = async () => {
      if (formData.province && formData.district && formData.district !== '') {
        setLocationLoading(true);
        try {
          const response = await rwandaLocationsApi.getSectors(formData.province, formData.district);
          const secData = response.data?.data || response.data || [];
          setSectors(Array.isArray(secData) ? secData : []);
        } catch (error) {
          console.error('Failed to fetch sectors:', error);
          setSectors([]);
        } finally {
          setLocationLoading(false);
        }
      } else {
        setSectors([]);
      }
      setCells([]);
      setVillages([]);
    };
    fetchSectors();
  }, [formData.province, formData.district]);

  // Fetch cells when sector changes
  useEffect(() => {
    const fetchCells = async () => {
      if (formData.province && formData.district && formData.sector && formData.sector !== '') {
        setLocationLoading(true);
        try {
          const response = await rwandaLocationsApi.getCells(formData.province, formData.district, formData.sector);
          const cellData = response.data?.data || response.data || [];
          setCells(Array.isArray(cellData) ? cellData : []);
        } catch (error) {
          console.error('Failed to fetch cells:', error);
          setCells([]);
        } finally {
          setLocationLoading(false);
        }
      } else {
        setCells([]);
      }
      setVillages([]);
    };
    fetchCells();
  }, [formData.province, formData.district, formData.sector]);

  // Fetch villages when cell changes
  useEffect(() => {
    const fetchVillages = async () => {
      if (formData.province && formData.district && formData.sector && formData.cell && formData.cell !== '') {
        setLocationLoading(true);
        try {
          const response = await rwandaLocationsApi.getVillages(formData.province, formData.district, formData.sector, formData.cell);
          const vilData = response.data?.data || response.data || [];
          setVillages(Array.isArray(vilData) ? vilData : []);
        } catch (error) {
          console.error('Failed to fetch villages:', error);
          setVillages([]);
        } finally {
          setLocationLoading(false);
        }
      } else {
        setVillages([]);
      }
    };
    fetchVillages();
  }, [formData.province, formData.district, formData.sector, formData.cell]);

  // Filter users
  useEffect(() => {
    let filtered = users;

    if (searchTerm) {
      filtered = filtered.filter(user =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (roleFilter !== 'ALL') {
      filtered = filtered.filter(user => user.role === roleFilter);
    }

    setFilteredUsers(filtered);

    setStats({
      totalUsers: users.length,
      volunteers: users.filter(u => u.role === UserRole.VOLUNTEER).length,
      citizens: users.filter(u => u.role === UserRole.CITIZEN).length,
      admins: users.filter(u => u.role === UserRole.ADMIN).length,
    });
  }, [users, searchTerm, roleFilter]);

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case UserRole.ADMIN: return 'danger';
      case UserRole.VOLUNTEER: return 'success';
      case UserRole.CITIZEN: return 'info';
      default: return 'gray';
    }
  };

  const getUserProvince = (user: User) => user.province || user.location?.province || '';
  const getUserDistrict = (user: User) => user.district || user.location?.district || '';

  const handleAddUser = () => {
    setEditingUser(null);
    setFormData({
      name: '',
      email: '',
      phoneNumber: '',
      role: UserRole.CITIZEN,
      province: '',
      district: '',
      sector: '',
      cell: '',
      village: '',
      newPassword: '',
      confirmPassword: '',
    });
    setDistricts([]);
    setSectors([]);
    setCells([]);
    setVillages([]);
    setIsModalOpen(true);
  };

  const handleViewUser = (user: User) => {
    setSelectedUser(user);
    setIsViewModalOpen(true);
  };

  const handleEditUser = (user: User) => {
    setEditingUser(user);
    const province = getUserProvince(user);
    const district = getUserDistrict(user);
    setFormData({
      name: user.name,
      email: user.email,
      phoneNumber: user.phoneNumber,
      role: user.role,
      province,
      district,
      sector: user.sector || '',
      cell: user.cell || '',
      village: user.village || '',
      newPassword: '',
      confirmPassword: '',
    });
    // Reset location dropdowns - the useEffect hooks will re-fetch based on the set values
    setDistricts([]);
    setSectors([]);
    setCells([]);
    setVillages([]);
    setIsModalOpen(true);
  };

  const handleSaveUser = async () => {
    if (!formData.name.trim() || !formData.email.trim() || !formData.phoneNumber.trim()) {
      toast.error('Please fill in all required fields');
      return;
    }

    // Password validation
    if (formData.newPassword || formData.confirmPassword) {
      if (formData.newPassword.length < 8) {
        toast.error('Password must be at least 8 characters');
        return;
      }
      if (formData.newPassword !== formData.confirmPassword) {
        toast.error('Passwords do not match');
        return;
      }
    }

    setIsSaving(true);
    try {
      if (editingUser) {
        // Update user profile
        await usersApi.update(editingUser.userId, {
          name: formData.name,
          email: formData.email,
          phoneNumber: formData.phoneNumber,
          role: formData.role,
          sector: formData.sector || undefined,
          cell: formData.cell || undefined,
          village: formData.village || undefined,
        });

        // Update password if provided
        if (formData.newPassword) {
          await adminApi.resetUserPassword(editingUser.userId, formData.newPassword);
        }

        toast.success('User updated successfully');
      } else {
        toast.error('User creation is handled through registration');
      }

      setIsModalOpen(false);
      setEditingUser(null);
      fetchUsers();
    } catch (error: any) {
      const msg = error.response?.data?.message || error.message || 'Failed to save user';
      toast.error(msg);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteUser = async (userId: number) => {
    if (window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      setIsDeleting(userId);
      try {
        await adminApi.deleteUser(userId);
        setUsers(prev => prev.filter(u => u.userId !== userId));
        toast.success('User deleted successfully');
      } catch (error: any) {
        const msg = error.response?.data?.message || 'Failed to delete user';
        toast.error(msg);
      } finally {
        setIsDeleting(null);
      }
    }
  };

  const handleToggleLock = async (user: User) => {
    const isLocked = user.accountLocked;
    const action = isLocked ? 'unlock' : 'lock';
    if (!window.confirm(`Are you sure you want to ${action} this user's account?`)) return;

    setIsTogglingLock(user.userId);
    try {
      if (isLocked) {
        await adminApi.unlockUser(user.userId);
      } else {
        await adminApi.lockUser(user.userId);
      }
      setUsers(prev =>
        prev.map(u =>
          u.userId === user.userId ? { ...u, accountLocked: !isLocked } : u
        )
      );
      toast.success(`User account ${isLocked ? 'unlocked' : 'locked'} successfully`);
    } catch (error: any) {
      const msg = error.response?.data?.message || `Failed to ${action} user`;
      toast.error(msg);
    } finally {
      setIsTogglingLock(null);
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
                  className={`flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors ${
                    user.accountLocked ? 'border-red-200 bg-red-50' : 'border-gray-200'
                  }`}
                >
                  <div className="flex items-center space-x-4">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                      user.accountLocked ? 'bg-red-100' : 'bg-gray-100'
                    }`}>
                      {user.accountLocked ? (
                        <Lock className="w-6 h-6 text-red-600" />
                      ) : (
                        <Users className="w-6 h-6 text-gray-600" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-3">
                        <h3 className="font-medium text-gray-900">{user.name}</h3>
                        <Badge variant={getRoleBadgeVariant(user.role)}>
                          {user.role}
                        </Badge>
                        {user.accountLocked && (
                          <Badge variant="danger">LOCKED</Badge>
                        )}
                      </div>
                      <p className="text-sm text-gray-500">{user.email}</p>
                      <div className="flex items-center text-xs text-gray-400 mt-1">
                        <MapPin className="w-3 h-3 mr-1" />
                        {getUserDistrict(user) || 'N/A'}, {getUserProvince(user) || 'N/A'}
                        {user.skills && user.skills.length > 0 && (
                          <>
                            <span className="mx-2">&bull;</span>
                            <Award className="w-3 h-3 mr-1" />
                            {user.skills.length} skills
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      size="sm"
                      variant="secondary"
                      icon={Eye}
                      onClick={() => handleViewUser(user)}
                    >
                      View
                    </Button>
                    <Button
                      size="sm"
                      variant="secondary"
                      icon={Edit}
                      onClick={() => handleEditUser(user)}
                    >
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      variant={user.accountLocked ? 'secondary' : 'danger'}
                      icon={user.accountLocked ? Unlock : Lock}
                      onClick={() => handleToggleLock(user)}
                      loading={isTogglingLock === user.userId}
                      disabled={isTogglingLock === user.userId}
                    >
                      {user.accountLocked ? 'Unlock' : 'Lock'}
                    </Button>
                    <Button
                      size="sm"
                      variant="danger"
                      icon={Trash2}
                      onClick={() => handleDeleteUser(user.userId)}
                      loading={isDeleting === user.userId}
                      disabled={isDeleting === user.userId}
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center space-x-4 mt-6">
              <Button
                size="sm"
                variant="secondary"
                onClick={() => setCurrentPage(p => Math.max(0, p - 1))}
                disabled={currentPage === 0}
              >
                Previous
              </Button>
              <span className="text-sm text-gray-600">
                Page {currentPage + 1} of {totalPages}
              </span>
              <Button
                size="sm"
                variant="secondary"
                onClick={() => setCurrentPage(p => Math.min(totalPages - 1, p + 1))}
                disabled={currentPage >= totalPages - 1}
              >
                Next
              </Button>
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
        <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-1">
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

          {/* Location Section - Rwanda API cascading dropdowns */}
          <div className="border-t pt-4">
            <h4 className="font-medium text-gray-900 mb-3 flex items-center">
              <MapPin className="w-4 h-4 mr-2" />
              Location
              {locationLoading && (
                <span className="ml-2 text-xs text-gray-500">Loading...</span>
              )}
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Province</label>
                <select
                  className="input-field"
                  value={formData.province}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    province: e.target.value,
                    district: '',
                    sector: '',
                    cell: '',
                    village: '',
                  }))}
                >
                  <option value="">Select Province</option>
                  {provinces.map((p) => (
                    <option key={p} value={p}>{p}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">District</label>
                <select
                  className="input-field"
                  value={formData.district}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    district: e.target.value,
                    sector: '',
                    cell: '',
                    village: '',
                  }))}
                  disabled={!formData.province}
                >
                  <option value="">Select District</option>
                  {districts.map((d) => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Sector</label>
                <select
                  className="input-field"
                  value={formData.sector}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    sector: e.target.value,
                    cell: '',
                    village: '',
                  }))}
                  disabled={!formData.district}
                >
                  <option value="">Select Sector</option>
                  {sectors.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Cell</label>
                <select
                  className="input-field"
                  value={formData.cell}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    cell: e.target.value,
                    village: '',
                  }))}
                  disabled={!formData.sector}
                >
                  <option value="">Select Cell</option>
                  {cells.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Village</label>
                <select
                  className="input-field"
                  value={formData.village}
                  onChange={(e) => setFormData(prev => ({ ...prev, village: e.target.value }))}
                  disabled={!formData.cell}
                >
                  <option value="">Select Village</option>
                  {villages.map((v) => (
                    <option key={v} value={v}>{v}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Password Section (Edit mode only) */}
          {editingUser && (
            <div className="border-t pt-4">
              <h4 className="font-medium text-gray-900 mb-3 flex items-center">
                <Key className="w-4 h-4 mr-2" />
                Change Password
                <span className="ml-2 text-xs text-gray-500 font-normal">(leave blank to keep current password)</span>
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="New Password"
                  type="password"
                  value={formData.newPassword}
                  onChange={(e) => setFormData(prev => ({ ...prev, newPassword: e.target.value }))}
                  placeholder="Enter new password"
                />
                <Input
                  label="Confirm Password"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                  placeholder="Confirm new password"
                />
              </div>
              {formData.newPassword && formData.newPassword.length < 8 && (
                <p className="text-xs text-red-500 mt-1">Password must be at least 8 characters</p>
              )}
              {formData.newPassword && formData.confirmPassword && formData.newPassword !== formData.confirmPassword && (
                <p className="text-xs text-red-500 mt-1">Passwords do not match</p>
              )}
            </div>
          )}

          <div className="flex justify-end space-x-3 pt-4 border-t">
            <Button
              variant="secondary"
              onClick={() => setIsModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSaveUser}
              disabled={!formData.name.trim() || !formData.email.trim() || !formData.phoneNumber.trim() || isSaving}
              loading={isSaving}
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
              <div className={`w-16 h-16 rounded-full flex items-center justify-center ${
                selectedUser.accountLocked ? 'bg-red-100' : 'bg-gray-100'
              }`}>
                {selectedUser.accountLocked ? (
                  <Lock className="w-8 h-8 text-red-600" />
                ) : (
                  <Users className="w-8 h-8 text-gray-600" />
                )}
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900">{selectedUser.name}</h3>
                <div className="flex items-center space-x-2 mt-1">
                  <Badge variant={getRoleBadgeVariant(selectedUser.role)}>
                    {selectedUser.role}
                  </Badge>
                  {selectedUser.accountLocked ? (
                    <Badge variant="danger">
                      <ShieldOff className="w-3 h-3 mr-1 inline" />
                      Account Locked
                    </Badge>
                  ) : (
                    <Badge variant="success">
                      <Shield className="w-3 h-3 mr-1 inline" />
                      Active
                    </Badge>
                  )}
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
                  <p><span className="font-medium">Province:</span> {getUserProvince(selectedUser) || 'N/A'}</p>
                  <p><span className="font-medium">District:</span> {getUserDistrict(selectedUser) || 'N/A'}</p>
                  {(selectedUser.sector) && <p><span className="font-medium">Sector:</span> {selectedUser.sector}</p>}
                  {(selectedUser.cell) && <p><span className="font-medium">Cell:</span> {selectedUser.cell}</p>}
                  {(selectedUser.village) && <p><span className="font-medium">Village:</span> {selectedUser.village}</p>}
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

            <div className="flex justify-between pt-4 border-t">
              <div className="flex space-x-2">
                <Button
                  variant={selectedUser.accountLocked ? 'secondary' : 'danger'}
                  icon={selectedUser.accountLocked ? Unlock : Lock}
                  onClick={() => {
                    handleToggleLock(selectedUser);
                    setSelectedUser(prev => prev ? { ...prev, accountLocked: !prev.accountLocked } : null);
                  }}
                  loading={isTogglingLock === selectedUser.userId}
                  size="sm"
                >
                  {selectedUser.accountLocked ? 'Unlock Account' : 'Lock Account'}
                </Button>
              </div>
              <div className="flex space-x-3">
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
          </div>
        </Modal>
      )}
    </div>
  );
};

export default AdminUsersPage;
