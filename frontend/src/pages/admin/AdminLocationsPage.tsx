import React, { useState, useEffect } from 'react';
import { MapPin, Search, Filter, Users, Plus, Edit, Trash2, Eye } from 'lucide-react';
import { locationsApi } from '../../services/api';
import type { Location } from '../../types';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import EmptyState from '../../components/common/EmptyState';
import Modal from '../../components/common/Modal';
import Input from '../../components/common/Input';

const AdminLocationsPage: React.FC = () => {
  const [locations, setLocations] = useState<Location[]>([]);
  const [filteredLocations, setFilteredLocations] = useState<Location[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [provinceFilter, setProvinceFilter] = useState<string>('ALL');
  const [stats, setStats] = useState({
    totalLocations: 0,
    provinces: 0,
    districts: 0,
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [editingLocation, setEditingLocation] = useState<Location | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const [formData, setFormData] = useState({
    province: '',
    district: '',
    provinceCode: ''
  });

  // Mock Rwanda locations data (30 districts)
  const mockLocations: Location[] = [
    // Kigali City
    { locationId: 1, province: 'Kigali City', district: 'Gasabo', provinceCode: 'KG01' },
    { locationId: 2, province: 'Kigali City', district: 'Kicukiro', provinceCode: 'KG02' },
    { locationId: 3, province: 'Kigali City', district: 'Nyarugenge', provinceCode: 'KG03' },
    
    // Eastern Province
    { locationId: 4, province: 'Eastern Province', district: 'Nyagatare', provinceCode: 'EP01' },
    { locationId: 5, province: 'Eastern Province', district: 'Gatsibo', provinceCode: 'EP02' },
    { locationId: 6, province: 'Eastern Province', district: 'Bugesera', provinceCode: 'EP03' },
    { locationId: 7, province: 'Eastern Province', district: 'Kayonza', provinceCode: 'EP04' },
    { locationId: 8, province: 'Eastern Province', district: 'Ngoma', provinceCode: 'EP05' },
    { locationId: 9, province: 'Eastern Province', district: 'Kirehe', provinceCode: 'EP06' },
    { locationId: 10, province: 'Eastern Province', district: 'Rwamagana', provinceCode: 'EP07' },
    
    // Western Province
    { locationId: 11, province: 'Western Province', district: 'Rusizi', provinceCode: 'WP01' },
    { locationId: 12, province: 'Western Province', district: 'Rubavu', provinceCode: 'WP02' },
    { locationId: 13, province: 'Western Province', district: 'Nyamasheke', provinceCode: 'WP03' },
    { locationId: 14, province: 'Western Province', district: 'Ngororero', provinceCode: 'WP04' },
    { locationId: 15, province: 'Western Province', district: 'Karongi', provinceCode: 'WP05' },
    { locationId: 16, province: 'Western Province', district: 'Rutsiro', provinceCode: 'WP06' },
    { locationId: 17, province: 'Western Province', district: 'Nyabihu', provinceCode: 'WP07' },
    
    // Southern Province
    { locationId: 18, province: 'Southern Province', district: 'Kamonyi', provinceCode: 'SP01' },
    { locationId: 19, province: 'Southern Province', district: 'Nyamagabe', provinceCode: 'SP02' },
    { locationId: 20, province: 'Southern Province', district: 'Huye', provinceCode: 'SP03' },
    { locationId: 21, province: 'Southern Province', district: 'Nyanza', provinceCode: 'SP04' },
    { locationId: 22, province: 'Southern Province', district: 'Gisagara', provinceCode: 'SP05' },
    { locationId: 23, province: 'Southern Province', district: 'Ruhango', provinceCode: 'SP06' },
    { locationId: 24, province: 'Southern Province', district: 'Muhanga', provinceCode: 'SP07' },
    { locationId: 25, province: 'Southern Province', district: 'Nyaruguru', provinceCode: 'SP08' },
    
    // Northern Province
    { locationId: 26, province: 'Northern Province', district: 'Gicumbi', provinceCode: 'NP01' },
    { locationId: 27, province: 'Northern Province', district: 'Gakenke', provinceCode: 'NP02' },
    { locationId: 28, province: 'Northern Province', district: 'Burera', provinceCode: 'NP03' },
    { locationId: 29, province: 'Northern Province', district: 'Rulindo', provinceCode: 'NP04' },
    { locationId: 30, province: 'Northern Province', district: 'Musanze', provinceCode: 'NP05' },
  ];

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        setIsLoading(true);
        try {
          const response = await locationsApi.getAll();
          setLocations(response.data);
        } catch (error) {
          setLocations(mockLocations);
        }
      } catch (error) {
        console.error('Failed to fetch locations:', error);
        setLocations(mockLocations);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLocations();
  }, []);

  useEffect(() => {
    let filtered = locations;

    if (searchTerm) {
      filtered = filtered.filter(location => 
        location.province.toLowerCase().includes(searchTerm.toLowerCase()) ||
        location.district.toLowerCase().includes(searchTerm.toLowerCase()) ||
        location.provinceCode.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (provinceFilter !== 'ALL') {
      filtered = filtered.filter(location => location.province === provinceFilter);
    }

    setFilteredLocations(filtered);

    const uniqueProvinces = [...new Set(locations.map(l => l.province))];
    setStats({
      totalLocations: locations.length,
      provinces: uniqueProvinces.length,
      districts: locations.length,
    });
  }, [locations, searchTerm, provinceFilter]);

  const getProvinceColor = (province: string) => {
    const colors = {
      'Kigali City': 'bg-blue-100 text-blue-800',
      'Eastern Province': 'bg-green-100 text-green-800',
      'Western Province': 'bg-purple-100 text-purple-800',
      'Southern Province': 'bg-orange-100 text-orange-800',
      'Northern Province': 'bg-red-100 text-red-800',
    };
    return colors[province as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const provinces = [...new Set(locations.map(l => l.province))];

  const handleAddLocation = () => {
    setEditingLocation(null);
    setFormData({
      province: '',
      district: '',
      provinceCode: ''
    });
    setIsModalOpen(true);
  };

  const handleViewLocation = (location: Location) => {
    setSelectedLocation(location);
    setIsViewModalOpen(true);
  };

  const handleEditLocation = (location: Location) => {
    setEditingLocation(location);
    setFormData({
      province: location.province,
      district: location.district,
      provinceCode: location.provinceCode
    });
    setIsModalOpen(true);
  };

  const handleSaveLocation = async () => {
    try {
      if (editingLocation) {
        const updatedLocation = { ...editingLocation, ...formData };
        setLocations(prev => prev.map(l => l.locationId === editingLocation.locationId ? updatedLocation : l));
      } else {
        const newLocation: Location = {
          locationId: Math.max(...locations.map(l => l.locationId)) + 1,
          ...formData
        };
        setLocations(prev => [...prev, newLocation]);
      }
      setIsModalOpen(false);
    } catch (error) {
      console.error('Failed to save location:', error);
    }
  };

  const handleDeleteLocation = async (locationId: number) => {
    if (window.confirm('Are you sure you want to delete this location?')) {
      try {
        setLocations(prev => prev.filter(l => l.locationId !== locationId));
      } catch (error) {
        console.error('Failed to delete location:', error);
      }
    }
  };

  if (isLoading) {
    return <LoadingSpinner size="lg" text="Loading locations..." />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Location Management</h1>
          <p className="text-gray-600 mt-1">Manage Rwanda's administrative hierarchy</p>
        </div>
        <Button icon={Plus} onClick={handleAddLocation}>
          Add New Location
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <div className="flex items-center">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <MapPin className="w-5 h-5 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Locations</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalLocations}</p>
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <MapPin className="w-5 h-5 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Provinces</p>
              <p className="text-2xl font-bold text-gray-900">{stats.provinces}</p>
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <MapPin className="w-5 h-5 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Districts</p>
              <p className="text-2xl font-bold text-gray-900">{stats.districts}</p>
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
                placeholder="Search by province, district, or code..."
                className="input-field pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <div className="sm:w-64">
            <select
              className="input-field"
              value={provinceFilter}
              onChange={(e) => setProvinceFilter(e.target.value)}
            >
              <option value="ALL">All Provinces</option>
              {provinces.map(province => (
                <option key={province} value={province}>{province}</option>
              ))}
            </select>
          </div>
        </div>
      </Card>

      {/* Locations Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredLocations.length === 0 ? (
          <div className="col-span-full">
            <EmptyState
              icon={MapPin}
              title="No locations found"
              description="No locations match your search criteria"
            />
          </div>
        ) : (
          filteredLocations.map((location) => (
            <Card key={location.locationId} hover>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center mb-2">
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                      <MapPin className="w-4 h-4 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{location.district}</h3>
                      <p className="text-xs text-gray-500">{location.provinceCode}</p>
                    </div>
                  </div>
                  
                  <div className="mb-3">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getProvinceColor(location.province)}`}>
                      {location.province}
                    </span>
                  </div>
                  
                  <div className="flex items-center text-xs text-gray-500">
                    <Users className="w-3 h-3 mr-1" />
                    <span>Active users in this location</span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-2 mt-4 pt-4 border-t border-gray-200">
                <Button
                  size="sm"
                  variant="secondary"
                  icon={Eye}
                  onClick={() => handleViewLocation(location)}
                >
                  View
                </Button>
                <Button
                  size="sm"
                  variant="secondary"
                  icon={Edit}
                  onClick={() => handleEditLocation(location)}
                >
                  Edit
                </Button>
                <Button
                  size="sm"
                  variant="danger"
                  icon={Trash2}
                  onClick={() => handleDeleteLocation(location.locationId)}
                >
                  Delete
                </Button>
              </div>
            </Card>
          ))
        )}
      </div>

      {/* Province Summary */}
      <Card padding="none">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Province Summary</h2>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {provinces.map(province => {
              const districtCount = locations.filter(l => l.province === province).length;
              return (
                <div key={province} className="text-center p-4 border border-gray-200 rounded-lg">
                  <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium mb-2 ${getProvinceColor(province)}`}>
                    {province}
                  </div>
                  <p className="text-2xl font-bold text-gray-900">{districtCount}</p>
                  <p className="text-xs text-gray-500">Districts</p>
                </div>
              );
            })}
          </div>
        </div>
      </Card>

      {/* Add/Edit Location Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingLocation ? 'Edit Location' : 'Add New Location'}
      >
        <div className="space-y-4">
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
              <option value="">Select Province</option>
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
            placeholder="Enter district name"
            required
          />
          
          <Input
            label="Province Code"
            value={formData.provinceCode}
            onChange={(e) => setFormData(prev => ({ ...prev, provinceCode: e.target.value.toUpperCase() }))}
            placeholder="e.g., KG01, EP01, WP01"
            required
          />
          
          <div className="flex justify-end space-x-3 pt-4">
            <Button
              variant="secondary"
              onClick={() => setIsModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSaveLocation}
              disabled={!formData.province.trim() || !formData.district.trim() || !formData.provinceCode.trim()}
            >
              {editingLocation ? 'Update' : 'Create'} Location
            </Button>
          </div>
        </div>
      </Modal>

      {/* View Location Modal */}
      {selectedLocation && (
        <Modal
          isOpen={isViewModalOpen}
          onClose={() => setIsViewModalOpen(false)}
          title="Location Details"
        >
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <MapPin className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900">{selectedLocation.district}</h3>
                <p className="text-sm text-gray-500">Location ID: {selectedLocation.locationId}</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Administrative Details</h4>
                <div className="bg-gray-50 p-3 rounded-lg space-y-2">
                  <p><span className="font-medium">Province:</span> {selectedLocation.province}</p>
                  <p><span className="font-medium">District:</span> {selectedLocation.district}</p>
                  <p><span className="font-medium">Province Code:</span> {selectedLocation.provinceCode}</p>
                </div>
              </div>
              
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Province Information</h4>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getProvinceColor(selectedLocation.province)}`}>
                    {selectedLocation.province}
                  </span>
                  <p className="text-sm text-gray-600 mt-2">
                    Part of Rwanda's administrative structure
                  </p>
                </div>
              </div>
            </div>
            
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex items-center">
                <Users className="w-5 h-5 text-blue-600 mr-2" />
                <div>
                  <p className="font-medium text-blue-900">User Activity</p>
                  <p className="text-sm text-blue-700">Citizens and volunteers are registered in this location</p>
                </div>
              </div>
            </div>
            
            <div className="flex justify-end space-x-3 pt-4">
              <Button variant="secondary" onClick={() => setIsViewModalOpen(false)}>
                Close
              </Button>
              <Button onClick={() => {
                setIsViewModalOpen(false);
                handleEditLocation(selectedLocation);
              }} icon={Edit}>
                Edit Location
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default AdminLocationsPage;