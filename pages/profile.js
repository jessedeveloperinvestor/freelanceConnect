import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import ProtectedRoute from '../components/ProtectedRoute';
import { useAuth } from '../hooks/useAuth';

function ProfilePage() {
  const { user, updateUser } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [skillInput, setSkillInput] = useState('');
  const router = useRouter();
  
  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm();
  const watchedSkills = watch('skills', []);
  
  // Initialize form values from user data
  useEffect(() => {
    if (user) {
      setValue('fullName', user.fullName || '');
      setValue('bio', user.bio || '');
      setValue('skills', user.skills || []);
      setValue('location', user.location || '');
      setValue('phoneNumber', user.phoneNumber || '');
      setValue('website', user.website || '');
    }
  }, [user, setValue]);
  
  const addSkill = () => {
    if (skillInput.trim() === '') return;
    
    const currentSkills = watch('skills', []);
    if (!currentSkills.includes(skillInput.trim())) {
      setValue('skills', [...currentSkills, skillInput.trim()]);
    }
    
    setSkillInput('');
  };
  
  const removeSkill = (skillToRemove) => {
    const currentSkills = watch('skills', []);
    setValue('skills', currentSkills.filter(skill => skill !== skillToRemove));
  };
  
  const onSubmit = async (data) => {
    setServerError('');
    setSuccessMessage('');
    setIsSubmitting(true);
    
    try {
      const updatedUser = await updateUser(data);
      setSuccessMessage('Profile updated successfully!');
      
      // Scroll to top to show the success message
      window.scrollTo(0, 0);
    } catch (error) {
      setServerError(error.message || 'Failed to update profile. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  if (!user) {
    return null; // Protected route handles redirecting
  }
  
  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h1 className="text-2xl font-bold mb-6">Edit Profile</h1>
        
        {/* Success Message */}
        {successMessage && (
          <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-6">
            <p>{successMessage}</p>
          </div>
        )}
        
        {/* Error Message */}
        {serverError && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6">
            <p>{serverError}</p>
          </div>
        )}
        
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label htmlFor="fullName" className="block text-gray-700 font-medium mb-2">
                Full Name
              </label>
              <input
                id="fullName"
                type="text"
                className={`input-field ${errors.fullName ? 'border-red-500' : ''}`}
                {...register('fullName', { required: 'Full name is required' })}
              />
              {errors.fullName && (
                <p className="mt-1 text-red-500 text-sm">{errors.fullName.message}</p>
              )}
            </div>
            
            <div>
              <label htmlFor="location" className="block text-gray-700 font-medium mb-2">
                Location
              </label>
              <input
                id="location"
                type="text"
                className="input-field"
                placeholder="e.g., New York, USA"
                {...register('location')}
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label htmlFor="phoneNumber" className="block text-gray-700 font-medium mb-2">
                Phone Number
              </label>
              <input
                id="phoneNumber"
                type="tel"
                className="input-field"
                placeholder="e.g., +1 (555) 123-4567"
                {...register('phoneNumber')}
              />
            </div>
            
            <div>
              <label htmlFor="website" className="block text-gray-700 font-medium mb-2">
                Website
              </label>
              <input
                id="website"
                type="url"
                className="input-field"
                placeholder="e.g., https://yourwebsite.com"
                {...register('website')}
              />
            </div>
          </div>
          
          {user.role === 'professional' && (
            <>
              <div className="mb-6">
                <label htmlFor="bio" className="block text-gray-700 font-medium mb-2">
                  Bio
                </label>
                <textarea
                  id="bio"
                  rows="4"
                  className={`input-field ${errors.bio ? 'border-red-500' : ''}`}
                  placeholder="Tell clients about your background, experience, and skills..."
                  {...register('bio', { 
                    required: 'Bio is required for professional accounts' 
                  })}
                ></textarea>
                {errors.bio && (
                  <p className="mt-1 text-red-500 text-sm">{errors.bio.message}</p>
                )}
              </div>
              
              <div className="mb-6">
                <label className="block text-gray-700 font-medium mb-2">
                  Skills
                </label>
                <div className="flex">
                  <input
                    type="text"
                    value={skillInput}
                    onChange={(e) => setSkillInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                    className="flex-1 input-field rounded-r-none"
                    placeholder="e.g., Web Design, JavaScript, React"
                  />
                  <button
                    type="button"
                    onClick={addSkill}
                    className="px-4 py-2 bg-blue-600 text-white rounded-r-md hover:bg-blue-700 transition-colors"
                  >
                    Add
                  </button>
                </div>
                
                {watchedSkills.length > 0 ? (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {watchedSkills.map((skill, index) => (
                      <div key={index} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full flex items-center">
                        <span>{skill}</span>
                        <button
                          type="button"
                          onClick={() => removeSkill(skill)}
                          className="ml-2 text-blue-800 hover:text-blue-900 focus:outline-none"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="mt-2 text-gray-500 text-sm">No skills added yet</p>
                )}
                
                {errors.skills && (
                  <p className="mt-1 text-red-500 text-sm">{errors.skills.message}</p>
                )}
              </div>
            </>
          )}
          
          <div className="flex justify-end space-x-3 mt-8">
            <button
              type="button"
              onClick={() => router.push('/dashboard')}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-70"
            >
              {isSubmitting ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
      
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold mb-6">Account Information</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <p className="text-gray-600">Username</p>
            <p className="font-medium">{user.username}</p>
          </div>
          
          <div>
            <p className="text-gray-600">Email Address</p>
            <p className="font-medium">{user.email}</p>
          </div>
          
          <div>
            <p className="text-gray-600">Account Type</p>
            <p className="font-medium capitalize">{user.role}</p>
          </div>
          
          <div>
            <p className="text-gray-600">Member Since</p>
            <p className="font-medium">
              {new Date(user.createdAt).toLocaleDateString(undefined, {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </p>
          </div>
        </div>
        
        <div className="mt-8 border-t pt-6">
          <h3 className="text-lg font-semibold mb-4">Password</h3>
          <button 
            type="button"
            onClick={() => router.push('/change-password')}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100 transition-colors"
          >
            Change Password
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Profile() {
  return (
    <ProtectedRoute>
      <ProfilePage />
    </ProtectedRoute>
  );
}
