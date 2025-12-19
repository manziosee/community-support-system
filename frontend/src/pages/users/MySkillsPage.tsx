import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Star, Search, Eye, Edit, X } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { skillsApi, usersApi } from '../../services/api';
import type { Skill } from '../../types';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import EmptyState from '../../components/common/EmptyState';
import toast from 'react-hot-toast';

const MySkillsPage: React.FC = () => {
  const { user, refreshUser } = useAuth();
  const [userSkills, setUserSkills] = useState<Skill[]>([]);
  const [allSkills, setAllSkills] = useState<Skill[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedSkill, setSelectedSkill] = useState<Skill | null>(null);
  const [editingSkill, setEditingSkill] = useState<Skill | null>(null);
  const [editFormData, setEditFormData] = useState({ skillName: '', description: '' });
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchSkills();
  }, []);

  const fetchSkills = async () => {
    try {
      setIsLoading(true);
      
      // Fetch all available skills
      const allSkillsResponse = await skillsApi.getAll();
      setAllSkills(allSkillsResponse.data);
      
      // Get user skills from user object
      if (user?.skills) {
        setUserSkills(user.skills);
      } else {
        setUserSkills([]);
      }
      
    } catch (error) {
      console.error('Failed to fetch skills:', error);
      toast.error('Failed to load skills');
      setAllSkills([]);
      setUserSkills([]);
    } finally {
      setIsLoading(false);
    }
  };

  const addSkill = async (skill: Skill) => {
    if (!user) return;
    
    if (userSkills.find(s => s.skillId === skill.skillId)) {
      toast.error('Skill already added');
      return;
    }
    
    try {
      // Update local state immediately for better UX
      const updatedSkills = [...userSkills, skill];
      setUserSkills(updatedSkills);
      setShowAddModal(false);
      
      toast.success(`Added ${skill.skillName} to your skills`);
      
    } catch (error) {
      console.error('Failed to add skill:', error);
      toast.error('Failed to add skill');
    }
  };

  const removeSkill = async (skillId: number) => {
    const skillToRemove = userSkills.find(s => s.skillId === skillId);
    if (!skillToRemove) return;
    
    if (!window.confirm(`Are you sure you want to remove ${skillToRemove.skillName} from your skills?`)) {
      return;
    }
    
    try {
      // Update local state immediately
      const updatedSkills = userSkills.filter(s => s.skillId !== skillId);
      setUserSkills(updatedSkills);
      
      toast.success(`Removed ${skillToRemove.skillName} from your skills`);
      
    } catch (error) {
      console.error('Failed to remove skill:', error);
      toast.error('Failed to remove skill');
    }
  };

  const editSkill = (skill: Skill) => {
    setEditingSkill(skill);
    setEditFormData({ skillName: skill.skillName, description: skill.description });
  };

  const saveEditedSkill = async () => {
    if (!editingSkill || !editFormData.skillName.trim() || !editFormData.description.trim()) {
      toast.error('Please fill in all fields');
      return;
    }
    
    try {
      // Update local state
      setUserSkills(prev => prev.map(s => 
        s.skillId === editingSkill.skillId 
          ? { ...s, skillName: editFormData.skillName.trim(), description: editFormData.description.trim() }
          : s
      ));
      
      setEditingSkill(null);
      toast.success('Skill updated successfully');
      
    } catch (error) {
      console.error('Failed to update skill:', error);
      toast.error('Failed to update skill');
    }
  };

  const availableSkills = allSkills.filter(skill => 
    !userSkills.find(userSkill => userSkill.skillId === skill.skillId) &&
    skill.skillName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return <LoadingSpinner size="lg" text="Loading your skills..." />;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Skills</h1>
          <p className="text-gray-600">Manage your volunteer skills and expertise</p>
        </div>
        <Button icon={Plus} onClick={() => setShowAddModal(true)}>
          Add Skill
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <Star className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Total Skills</h2>
              <p className="text-2xl font-bold text-green-600">{userSkills.length}</p>
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Plus className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Available Skills</h2>
              <p className="text-2xl font-bold text-blue-600">{availableSkills.length}</p>
            </div>
          </div>
        </Card>
      </div>

      <Card>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Your Skills</h2>
        {userSkills.length === 0 ? (
          <EmptyState
            icon={Star}
            title="No skills added yet"
            description="Add skills to showcase your expertise to citizens"
            actionLabel="Add Your First Skill"
            onAction={() => setShowAddModal(true)}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {userSkills.map((skill) => (
              <div key={skill.skillId} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-semibold text-gray-900">{skill.skillName}</h3>
                  <div className="flex space-x-1">
                    <Button
                      size="sm"
                      variant="secondary"
                      icon={Eye}
                      onClick={() => setSelectedSkill(skill)}
                    >
                      View
                    </Button>
                    <Button
                      size="sm"
                      variant="secondary"
                      icon={Edit}
                      onClick={() => editSkill(skill)}
                    >
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      variant="danger"
                      icon={Trash2}
                      onClick={() => removeSkill(skill.skillId)}
                    >
                      Delete
                    </Button>
                  </div>
                </div>
                <p className="text-sm text-gray-600">{skill.description}</p>
                <Badge variant="success" size="sm" className="mt-2">
                  Active
                </Badge>
              </div>
            ))}
          </div>
        )}
      </Card>

      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-900">Add New Skill</h2>
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => setShowAddModal(false)}
                >
                  Close
                </Button>
              </div>
              
              <div className="mb-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Search skills..."
                    className="input-field pl-10"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-3 max-h-96 overflow-y-auto">
                {availableSkills.length === 0 ? (
                  <p className="text-center text-gray-500 py-8">
                    {searchTerm ? 'No skills found matching your search' : 'All available skills have been added'}
                  </p>
                ) : (
                  availableSkills.map((skill) => (
                    <div key={skill.skillId} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900">{skill.skillName}</h3>
                          <p className="text-sm text-gray-600 mt-1">{skill.description}</p>
                        </div>
                        <Button
                          size="sm"
                          onClick={() => addSkill(skill)}
                        >
                          Add
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* View Skill Modal */}
      {selectedSkill && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-lg w-full">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-900">Skill Details</h2>
                <Button size="sm" variant="secondary" icon={X} onClick={() => setSelectedSkill(null)}>
                  Close
                </Button>
              </div>
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium text-gray-900 mb-1">Skill Name</h3>
                  <p className="text-gray-700">{selectedSkill.skillName}</p>
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 mb-1">Description</h3>
                  <p className="text-gray-700">{selectedSkill.description}</p>
                </div>
                <div className="flex justify-end space-x-2 pt-4">
                  <Button variant="secondary" onClick={() => setSelectedSkill(null)}>
                    Close
                  </Button>
                  <Button onClick={() => {
                    setSelectedSkill(null);
                    editSkill(selectedSkill);
                  }} icon={Edit}>
                    Edit Skill
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Skill Modal */}
      {editingSkill && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-lg w-full">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-900">Edit Skill</h2>
                <Button size="sm" variant="secondary" icon={X} onClick={() => setEditingSkill(null)}>
                  Close
                </Button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Skill Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    className="input-field"
                    value={editFormData.skillName}
                    onChange={(e) => setEditFormData(prev => ({ ...prev, skillName: e.target.value }))}
                    placeholder="Enter skill name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    className="input-field"
                    rows={3}
                    value={editFormData.description}
                    onChange={(e) => setEditFormData(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Enter skill description"
                  />
                </div>
                <div className="flex justify-end space-x-2 pt-4">
                  <Button variant="secondary" onClick={() => setEditingSkill(null)}>
                    Cancel
                  </Button>
                  <Button 
                    onClick={saveEditedSkill}
                    disabled={!editFormData.skillName.trim() || !editFormData.description.trim()}
                  >
                    Save Changes
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MySkillsPage;