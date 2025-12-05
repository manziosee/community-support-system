import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { User, Mail, Phone, MapPin, HelpCircle, Award } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { locationsApi, skillsApi } from '../../services/api';
import { UserRole } from '../../types';
import type { Location, Skill } from '../../types';
import Button from '../../components/common/Button';

const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  phoneNumber: z.string().regex(/^[0-9]{10}$/, 'Phone number must be exactly 10 digits'),
  role: z.enum([UserRole.CITIZEN, UserRole.VOLUNTEER]),
  locationId: z.number().min(1, 'Please select a location'),
  sector: z.string().optional(),
  cell: z.string().optional(),
  village: z.string().optional(),
  skills: z.array(z.number()).optional(),
});

type RegisterFormData = z.infer<typeof registerSchema>;

const RegisterPage: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [locations, setLocations] = useState<Location[]>([]);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [selectedRole, setSelectedRole] = useState<UserRole>(UserRole.CITIZEN);
  const { register: registerUser, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      role: UserRole.CITIZEN,
      skills: [],
    },
  });

  const watchedRole = watch('role');

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [locationsResponse, skillsResponse] = await Promise.all([
          locationsApi.getAll(),
          skillsApi.getAll(),
        ]);
        setLocations(locationsResponse.data);
        setSkills(skillsResponse.data);
      } catch (error) {
        console.error('Failed to fetch data:', error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    setSelectedRole(watchedRole);
  }, [watchedRole]);

  const onSubmit = async (data: RegisterFormData) => {
    try {
      setIsLoading(true);
      const userData = {
        ...data,
        location: { locationId: data.locationId },
        skills: data.skills?.map(skillId => ({ skillId })) || [],
      };
      await registerUser(userData);
      navigate('/dashboard');
    } catch (error) {
      // Error is handled by the auth context
    } finally {
      setIsLoading(false);
    }
  };

  const handleSkillToggle = (skillId: number) => {
    const currentSkills = watch('skills') || [];
    const updatedSkills = currentSkills.includes(skillId)
      ? currentSkills.filter(id => id !== skillId)
      : [...currentSkills, skillId];
    setValue('skills', updatedSkills);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="mx-auto w-16 h-16 bg-primary-600 rounded-full flex items-center justify-center">
            <HelpCircle className="w-8 h-8 text-white" />
          </div>
          <h2 className="mt-6 text-3xl font-bold text-gray-900">
            Join our community
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Create your account to start helping or getting help
          </p>
        </div>

        {/* Form */}
        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Name */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Full Name
              </label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  {...register('name')}
                  type="text"
                  className="input-field pl-10"
                  placeholder="Enter your full name"
                />
              </div>
              {errors.name && (
                <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email Address
              </label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  {...register('email')}
                  type="email"
                  className="input-field pl-10"
                  placeholder="Enter your email"
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
              )}
            </div>

            {/* Phone */}
            <div>
              <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700">
                Phone Number
              </label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Phone className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  {...register('phoneNumber')}
                  type="tel"
                  className="input-field pl-10"
                  placeholder="0788123456"
                />
              </div>
              {errors.phoneNumber && (
                <p className="mt-1 text-sm text-red-600">{errors.phoneNumber.message}</p>
              )}
            </div>

            {/* Role */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                I want to
              </label>
              <div className="mt-2 space-y-2">
                <label className="flex items-center">
                  <input
                    {...register('role')}
                    type="radio"
                    value={UserRole.CITIZEN}
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300"
                  />
                  <span className="ml-2 text-sm text-gray-700">Get help from volunteers</span>
                </label>
                <label className="flex items-center">
                  <input
                    {...register('role')}
                    type="radio"
                    value={UserRole.VOLUNTEER}
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300"
                  />
                  <span className="ml-2 text-sm text-gray-700">Help others as a volunteer</span>
                </label>
              </div>
              {errors.role && (
                <p className="mt-1 text-sm text-red-600">{errors.role.message}</p>
              )}
            </div>
          </div>

          {/* Location */}
          <div>
            <label htmlFor="locationId" className="block text-sm font-medium text-gray-700">
              Location (District)
            </label>
            <div className="mt-1 relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MapPin className="h-5 w-5 text-gray-400" />
              </div>
              <select
                {...register('locationId', { valueAsNumber: true })}
                className="input-field pl-10"
              >
                <option value="">Select your district</option>
                {locations.map((location) => (
                  <option key={location.locationId} value={location.locationId}>
                    {location.district}, {location.province}
                  </option>
                ))}
              </select>
            </div>
            {errors.locationId && (
              <p className="mt-1 text-sm text-red-600">{errors.locationId.message}</p>
            )}
          </div>

          {/* Additional Location Details */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label htmlFor="sector" className="block text-sm font-medium text-gray-700">
                Sector (Optional)
              </label>
              <input
                {...register('sector')}
                type="text"
                className="mt-1 input-field"
                placeholder="Enter sector"
              />
            </div>
            <div>
              <label htmlFor="cell" className="block text-sm font-medium text-gray-700">
                Cell (Optional)
              </label>
              <input
                {...register('cell')}
                type="text"
                className="mt-1 input-field"
                placeholder="Enter cell"
              />
            </div>
            <div>
              <label htmlFor="village" className="block text-sm font-medium text-gray-700">
                Village (Optional)
              </label>
              <input
                {...register('village')}
                type="text"
                className="mt-1 input-field"
                placeholder="Enter village"
              />
            </div>
          </div>

          {/* Skills (only for volunteers) */}
          {selectedRole === UserRole.VOLUNTEER && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                <Award className="inline w-4 h-4 mr-1" />
                Select your skills
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {skills.map((skill) => (
                  <label
                    key={skill.skillId}
                    className="flex items-center p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50"
                  >
                    <input
                      type="checkbox"
                      checked={(watch('skills') || []).includes(skill.skillId)}
                      onChange={() => handleSkillToggle(skill.skillId)}
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                    />
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-900">{skill.skillName}</p>
                      <p className="text-xs text-gray-500">{skill.description}</p>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Submit button */}
          <Button
            type="submit"
            className="w-full"
            loading={isLoading}
            disabled={isLoading}
          >
            Create Account
          </Button>

          {/* Sign in link */}
          <div className="text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{' '}
              <Link
                to="/login"
                className="font-medium text-primary-600 hover:text-primary-500"
              >
                Sign in here
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;