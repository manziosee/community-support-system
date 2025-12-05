import React, { useState, useEffect } from 'react';
import { Award, Search, Plus, Edit, Trash2, Users, Eye } from 'lucide-react';
import { skillsApi } from '../../services/api';
import type { Skill } from '../../types';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import EmptyState from '../../components/common/EmptyState';
import Modal from '../../components/common/Modal';
import Input from '../../components/common/Input';

const AdminSkillsPage: React.FC = () => {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [filteredSkills, setFilteredSkills] = useState<Skill[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [editingSkill, setEditingSkill] = useState<Skill | null>(null);
  const [selectedSkill, setSelectedSkill] = useState<Skill | null>(null);
  const [formData, setFormData] = useState({ skillName: '', description: '' });

  // Mock skills data
  const mockSkills: Skill[] = [
    {
      skillId: 1,
      skillName: 'Programming',
      description: 'Software development and coding assistance'
    },
    {
      skillId: 2,
      skillName: 'Tutoring',
      description: 'Academic support and educational assistance'
    },
    {
      skillId: 3,
      skillName: 'Healthcare',
      description: 'Medical assistance and health support'
    },
    {
      skillId: 4,
      skillName: 'Cooking',
      description: 'Food preparation and cooking assistance'
    },
    {
      skillId: 5,
      skillName: 'Transportation',
      description: 'Vehicle assistance and transportation services'
    },
    {
      skillId: 6,
      skillName: 'Construction',
      description: 'Building and repair work assistance'
    },
    {
      skillId: 7,
      skillName: 'Agriculture',
      description: 'Farming and agricultural support'
    },
    {
      skillId: 8,
      skillName: 'Technology Support',
      description: 'Computer and technology assistance'
    },
    {
      skillId: 9,
      skillName: 'Childcare',
      description: 'Child supervision and care assistance'
    },
    {
      skillId: 10,
      skillName: 'Elderly Care',
      description: 'Support and assistance for elderly citizens'
    }
  ];

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        setIsLoading(true);
        try {
          const response = await skillsApi.getAll();
          setSkills(response.data);
        } catch (error) {
          setSkills(mockSkills);
        }
      } catch (error) {
        console.error('Failed to fetch skills:', error);
        setSkills(mockSkills);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSkills();
  }, []);

  useEffect(() => {
    let filtered = skills;

    if (searchTerm) {
      filtered = filtered.filter(skill => 
        skill.skillName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        skill.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredSkills(filtered);
  }, [skills, searchTerm]);

  const handleAddSkill = () => {
    setEditingSkill(null);
    setFormData({ skillName: '', description: '' });
    setIsModalOpen(true);
  };

  const handleViewSkill = (skill: Skill) => {
    setSelectedSkill(skill);
    setIsViewModalOpen(true);
  };

  const handleEditSkill = (skill: Skill) => {
    setEditingSkill(skill);
    setFormData({ skillName: skill.skillName, description: skill.description });
    setIsModalOpen(true);
  };

  const handleSaveSkill = async () => {
    try {
      if (editingSkill) {
        // Update existing skill
        const updatedSkill = { ...editingSkill, ...formData };
        setSkills(prev => prev.map(s => s.skillId === editingSkill.skillId ? updatedSkill : s));
      } else {
        // Add new skill
        const newSkill: Skill = {
          skillId: Math.max(...skills.map(s => s.skillId)) + 1,
          ...formData
        };
        setSkills(prev => [...prev, newSkill]);
      }
      setIsModalOpen(false);
    } catch (error) {
      console.error('Failed to save skill:', error);
    }
  };

  const handleDeleteSkill = async (skillId: number) => {
    if (window.confirm('Are you sure you want to delete this skill?')) {
      try {
        setSkills(prev => prev.filter(s => s.skillId !== skillId));
      } catch (error) {
        console.error('Failed to delete skill:', error);
      }
    }
  };

  if (isLoading) {
    return <LoadingSpinner size="lg" text="Loading skills..." />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Skill Management</h1>
          <p className="text-gray-600 mt-1">Manage volunteer skill categories and descriptions</p>
        </div>
        <Button onClick={handleAddSkill} icon={Plus}>
          Add New Skill
        </Button>
      </div>

      {/* Stats Card */}
      <Card>
        <div className="flex items-center">
          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
            <Award className="w-6 h-6 text-blue-600" />
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-600">Total Skills</p>
            <p className="text-2xl font-bold text-gray-900">{skills.length}</p>
            <p className="text-xs text-gray-500">Available skill categories</p>
          </div>
        </div>
      </Card>

      {/* Search */}
      <Card>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search skills by name or description..."
            className="input-field pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </Card>

      {/* Skills Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredSkills.length === 0 ? (
          <div className="col-span-full">
            <EmptyState
              icon={Award}
              title="No skills found"
              description="No skills match your search criteria"
            />
          </div>
        ) : (
          filteredSkills.map((skill) => (
            <Card key={skill.skillId} hover>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center mb-2">
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                      <Award className="w-4 h-4 text-blue-600" />
                    </div>
                    <h3 className="font-semibold text-gray-900">{skill.skillName}</h3>
                  </div>
                  <p className="text-sm text-gray-600 mb-4">{skill.description}</p>
                  <div className="flex items-center text-xs text-gray-500">
                    <Users className="w-3 h-3 mr-1" />
                    <span>Used by volunteers</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-2 mt-4 pt-4 border-t border-gray-200">
                <Button
                  size="sm"
                  variant="secondary"
                  icon={Eye}
                  onClick={() => handleViewSkill(skill)}
                >
                  View
                </Button>
                <Button
                  size="sm"
                  variant="secondary"
                  icon={Edit}
                  onClick={() => handleEditSkill(skill)}
                >
                  Edit
                </Button>
                <Button
                  size="sm"
                  variant="danger"
                  icon={Trash2}
                  onClick={() => handleDeleteSkill(skill.skillId)}
                >
                  Delete
                </Button>
              </div>
            </Card>
          ))
        )}
      </div>

      {/* Add/Edit Skill Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingSkill ? 'Edit Skill' : 'Add New Skill'}
      >
        <div className="space-y-4">
          <Input
            label="Skill Name"
            value={formData.skillName}
            onChange={(e) => setFormData(prev => ({ ...prev, skillName: e.target.value }))}
            placeholder="Enter skill name"
            required
          />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              className="input-field"
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Enter skill description"
              required
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
              onClick={handleSaveSkill}
              disabled={!formData.skillName.trim() || !formData.description.trim()}
            >
              {editingSkill ? 'Update' : 'Create'} Skill
            </Button>
          </div>
        </div>
      </Modal>

      {/* View Skill Modal */}
      {selectedSkill && (
        <Modal
          isOpen={isViewModalOpen}
          onClose={() => setIsViewModalOpen(false)}
          title="Skill Details"
        >
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Award className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900">{selectedSkill.skillName}</h3>
                <p className="text-sm text-gray-500">Skill ID: {selectedSkill.skillId}</p>
              </div>
            </div>
            
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Description</h4>
              <p className="text-gray-600 bg-gray-50 p-3 rounded-lg">{selectedSkill.description}</p>
            </div>
            
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex items-center">
                <Users className="w-5 h-5 text-blue-600 mr-2" />
                <div>
                  <p className="font-medium text-blue-900">Volunteer Usage</p>
                  <p className="text-sm text-blue-700">This skill is used by volunteers in the system</p>
                </div>
              </div>
            </div>
            
            <div className="flex justify-end space-x-3 pt-4">
              <Button variant="secondary" onClick={() => setIsViewModalOpen(false)}>
                Close
              </Button>
              <Button onClick={() => {
                setIsViewModalOpen(false);
                handleEditSkill(selectedSkill);
              }} icon={Edit}>
                Edit Skill
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default AdminSkillsPage;