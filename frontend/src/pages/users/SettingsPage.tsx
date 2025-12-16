import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { settingsApi } from '../../services/api';
import Button from '../../components/common/Button';
import { Settings, Lock, Bell, User, Save } from 'lucide-react';

interface UserSettings {
  emailNotifications: boolean;
  pushNotifications: boolean;
  requestUpdates: boolean;
  assignmentUpdates: boolean;
}

const SettingsPage: React.FC = () => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [settings, setSettings] = useState<UserSettings>({
    emailNotifications: true,
    pushNotifications: true,
    requestUpdates: true,
    assignmentUpdates: true,
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    phoneNumber: user?.phoneNumber || '',
    sector: user?.sector || '',
    cell: user?.cell || '',
    village: user?.village || '',
  });

  useEffect(() => {
    if (user) {
      fetchUserSettings();
    }
  }, [user]);

  const fetchUserSettings = async () => {
    try {
      const response = await settingsApi.getUserSettings(user!.userId);
      setSettings(response.data);
    } catch (error) {
      console.error('Failed to fetch settings:', error);
      // Use default settings if API fails
      setSettings({
        emailNotifications: true,
        pushNotifications: true,
        requestUpdates: true,
        assignmentUpdates: true,
      });
    }
  };

  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert('New passwords do not match');
      return;
    }
    
    try {
      setIsLoading(true);
      // For demo purposes, simulate success
      await new Promise(resolve => setTimeout(resolve, 1000));
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      alert('Password updated successfully');
    } catch (error) {
      alert('Failed to update password');
    } finally {
      setIsLoading(false);
    }
  };

  const handleNotificationUpdate = async () => {
    try {
      setIsLoading(true);
      // For demo purposes, simulate success
      await new Promise(resolve => setTimeout(resolve, 1000));
      alert('Notification preferences updated');
    } catch (error) {
      alert('Failed to update preferences');
    } finally {
      setIsLoading(false);
    }
  };

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      // For demo purposes, simulate success
      await new Promise(resolve => setTimeout(resolve, 1000));
      alert('Profile updated successfully');
    } catch (error) {
      alert('Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 bg-gradient-to-br from-sky-400 to-sky-600 rounded-xl flex items-center justify-center">
          <Settings className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-600">Manage your account preferences</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Profile Settings */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center space-x-2 mb-6">
            <User className="w-5 h-5 text-sky-600" />
            <h2 className="text-lg font-semibold text-gray-900">Profile Information</h2>
          </div>
          
          <form onSubmit={handleProfileUpdate} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Full Name
              </label>
              <input
                type="text"
                value={profileData.name}
                onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                className="input-field"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone Number
              </label>
              <input
                type="tel"
                value={profileData.phoneNumber}
                onChange={(e) => setProfileData({ ...profileData, phoneNumber: e.target.value })}
                className="input-field"
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Sector
                </label>
                <input
                  type="text"
                  value={profileData.sector}
                  onChange={(e) => setProfileData({ ...profileData, sector: e.target.value })}
                  className="input-field"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Cell
                </label>
                <input
                  type="text"
                  value={profileData.cell}
                  onChange={(e) => setProfileData({ ...profileData, cell: e.target.value })}
                  className="input-field"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Village
                </label>
                <input
                  type="text"
                  value={profileData.village}
                  onChange={(e) => setProfileData({ ...profileData, village: e.target.value })}
                  className="input-field"
                />
              </div>
            </div>
            
            <Button type="submit" loading={isLoading} className="w-full">
              <Save className="w-4 h-4 mr-2" />
              Update Profile
            </Button>
          </form>
        </div>

        {/* Password Settings */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center space-x-2 mb-6">
            <Lock className="w-5 h-5 text-sky-600" />
            <h2 className="text-lg font-semibold text-gray-900">Change Password</h2>
          </div>
          
          <form onSubmit={handlePasswordUpdate} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Current Password
              </label>
              <input
                type="password"
                value={passwordData.currentPassword}
                onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                className="input-field"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                New Password
              </label>
              <input
                type="password"
                value={passwordData.newPassword}
                onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                className="input-field"
                required
                minLength={8}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Confirm New Password
              </label>
              <input
                type="password"
                value={passwordData.confirmPassword}
                onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                className="input-field"
                required
                minLength={8}
              />
            </div>
            
            <Button type="submit" loading={isLoading} className="w-full">
              <Lock className="w-4 h-4 mr-2" />
              Update Password
            </Button>
          </form>
        </div>

        {/* Notification Settings */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 lg:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-2">
              <Bell className="w-5 h-5 text-sky-600" />
              <h2 className="text-lg font-semibold text-gray-900">Notification Preferences</h2>
            </div>
            <Button onClick={handleNotificationUpdate} loading={isLoading}>
              <Save className="w-4 h-4 mr-2" />
              Save Preferences
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-gray-900">Email Notifications</h3>
                  <p className="text-sm text-gray-500">Receive notifications via email</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.emailNotifications}
                    onChange={(e) => setSettings({ ...settings, emailNotifications: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-sky-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-sky-600"></div>
                </label>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-gray-900">Request Updates</h3>
                  <p className="text-sm text-gray-500">Get notified about request status changes</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.requestUpdates}
                    onChange={(e) => setSettings({ ...settings, requestUpdates: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-sky-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-sky-600"></div>
                </label>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-gray-900">Push Notifications</h3>
                  <p className="text-sm text-gray-500">Receive browser notifications</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.pushNotifications}
                    onChange={(e) => setSettings({ ...settings, pushNotifications: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-sky-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-sky-600"></div>
                </label>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-gray-900">Assignment Updates</h3>
                  <p className="text-sm text-gray-500">Get notified about volunteer assignments</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.assignmentUpdates}
                    onChange={(e) => setSettings({ ...settings, assignmentUpdates: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-sky-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-sky-600"></div>
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;