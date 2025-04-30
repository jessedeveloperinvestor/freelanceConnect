import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import useSWR from 'swr';
import ServiceCard from '../../components/ServiceCard';
import ProjectCard from '../../components/ProjectCard';
import { useAuth } from '../../hooks/useAuth';

export default function ProfilePage() {
  const router = useRouter();
  const { id } = router.query;
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('about');
  
  // Fetch profile user data
  const { data: profileUser, error } = useSWR(id ? `/api/user/${id}` : null);
  
  // Fetch user's projects or services
  const { data: userProjects } = useSWR(
    id && profileUser?.role === 'client' ? `/api/projects?clientId=${id}` : null
  );
  
  const { data: userServices } = useSWR(
    id && profileUser?.role === 'professional' ? `/api/services?providerId=${id}` : null
  );
  
  const handleContactUser = () => {
    router.push(`/messages?recipient=${id}`);
  };
  
  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };
  
  // Show loading state
  if (!profileUser && !error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  // Show error state
  if (error || !profileUser) {
    return (
      <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-md">
        <p>Error loading profile. The user may not exist or you don't have permission to view this profile.</p>
        <Link href="/dashboard" className="text-red-700 font-medium underline mt-2 inline-block">
          Return to Dashboard
        </Link>
      </div>
    );
  }
  
  return (
    <div>
      <div className="mb-6">
        <button 
          onClick={() => router.back()}
          className="text-blue-600 hover:underline flex items-center"
        >
          <i className="fas fa-arrow-left mr-2"></i> Back
        </button>
      </div>
      
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {/* Profile Header */}
        <div className="bg-blue-600 text-white p-6">
          <div className="flex flex-col md:flex-row items-center md:items-start">
            <div className="w-24 h-24 bg-white text-blue-600 rounded-full flex items-center justify-center text-4xl font-bold mb-4 md:mb-0 md:mr-6">
              {profileUser.fullName ? profileUser.fullName.charAt(0).toUpperCase() : profileUser.username.charAt(0).toUpperCase()}
            </div>
            <div className="text-center md:text-left">
              <h1 className="text-2xl font-bold">{profileUser.fullName || profileUser.username}</h1>
              <p className="text-blue-200 mb-2">
                {profileUser.role === 'professional' ? 'Freelance Professional' : 'Client'}
              </p>
              {profileUser.location && (
                <p className="text-blue-100 mb-3">
                  <i className="fas fa-map-marker-alt mr-2"></i> {profileUser.location}
                </p>
              )}
              <div className="flex flex-wrap justify-center md:justify-start gap-2 mt-4">
                {user && user.id !== profileUser.id && (
                  <button 
                    onClick={handleContactUser}
                    className="bg-white text-blue-600 hover:bg-blue-50 px-4 py-2 rounded-md font-medium transition-colors"
                  >
                    <i className="fas fa-envelope mr-2"></i> Contact
                  </button>
                )}
                {profileUser.website && (
                  <a 
                    href={profileUser.website} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="bg-transparent border border-white text-white hover:bg-white hover:text-blue-600 px-4 py-2 rounded-md font-medium transition-colors"
                  >
                    <i className="fas fa-globe mr-2"></i> Website
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
        
        {/* Profile Navigation */}
        <div className="border-b">
          <div className="flex overflow-x-auto">
            <button 
              onClick={() => setActiveTab('about')}
              className={`px-6 py-3 font-medium ${activeTab === 'about' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-600 hover:text-gray-900'}`}
            >
              About
            </button>
            {profileUser.role === 'professional' && (
              <button 
                onClick={() => setActiveTab('services')}
                className={`px-6 py-3 font-medium ${activeTab === 'services' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-600 hover:text-gray-900'}`}
              >
                Services
              </button>
            )}
            {profileUser.role === 'client' && (
              <button 
                onClick={() => setActiveTab('projects')}
                className={`px-6 py-3 font-medium ${activeTab === 'projects' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-600 hover:text-gray-900'}`}
              >
                Projects
              </button>
            )}
          </div>
        </div>
        
        {/* Profile Content */}
        <div className="p-6">
          {/* About Tab */}
          {activeTab === 'about' && (
            <div>
              <div className="mb-6">
                <h2 className="text-xl font-semibold mb-4">Bio</h2>
                {profileUser.bio ? (
                  <p className="text-gray-700 whitespace-pre-line">{profileUser.bio}</p>
                ) : (
                  <p className="text-gray-500 italic">No bio provided</p>
                )}
              </div>
              
              {profileUser.role === 'professional' && profileUser.skills && profileUser.skills.length > 0 && (
                <div className="mb-6">
                  <h2 className="text-xl font-semibold mb-4">Skills</h2>
                  <div className="flex flex-wrap gap-2">
                    {profileUser.skills.map((skill, index) => (
                      <span key={index} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              
              <div>
                <h2 className="text-xl font-semibold mb-4">Account Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg">
                  <div>
                    <p className="text-gray-600 text-sm">Member since</p>
                    <p className="font-medium">{formatDate(profileUser.createdAt)}</p>
                  </div>
                  
                  <div>
                    <p className="text-gray-600 text-sm">Account type</p>
                    <p className="font-medium capitalize">{profileUser.role}</p>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* Services Tab */}
          {activeTab === 'services' && profileUser.role === 'professional' && (
            <div>
              <h2 className="text-xl font-semibold mb-6">Services Offered</h2>
              
              {!userServices ? (
                <div className="flex items-center justify-center h-40">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
                </div>
              ) : userServices.length === 0 ? (
                <div className="bg-gray-50 p-6 rounded-lg text-center">
                  <p className="text-gray-600">No services found</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {userServices
                    .filter(service => service.status === 'active')
                    .map(service => (
                      <ServiceCard key={service.id} service={service} />
                    ))}
                </div>
              )}
            </div>
          )}
          
          {/* Projects Tab */}
          {activeTab === 'projects' && profileUser.role === 'client' && (
            <div>
              <h2 className="text-xl font-semibold mb-6">Posted Projects</h2>
              
              {!userProjects ? (
                <div className="flex items-center justify-center h-40">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
                </div>
              ) : userProjects.length === 0 ? (
                <div className="bg-gray-50 p-6 rounded-lg text-center">
                  <p className="text-gray-600">No projects found</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {userProjects
                    .filter(project => project.status === 'open')
                    .map(project => (
                      <ProjectCard key={project.id} project={project} />
                    ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
