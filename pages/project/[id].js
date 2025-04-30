import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import useSWR from 'swr';
import ProtectedRoute from '../../components/ProtectedRoute';
import ProjectForm from '../../components/ProjectForm';
import { useAuth } from '../../hooks/useAuth';

function ProjectDetailPage() {
  const { user } = useAuth();
  const router = useRouter();
  const { id, edit } = router.query;
  const [isEditing, setIsEditing] = useState(false);
  const [clientUser, setClientUser] = useState(null);
  
  // Fetch project details
  const { data: project, error, mutate } = useSWR(id ? `/api/projects/${id}` : null);
  
  // Set editing mode based on URL query
  useEffect(() => {
    setIsEditing(edit === 'true');
  }, [edit]);
  
  // Fetch client information
  useEffect(() => {
    if (project && project.clientId) {
      const fetchClientUser = async () => {
        try {
          const response = await fetch(`/api/user/${project.clientId}`);
          if (response.ok) {
            const userData = await response.json();
            setClientUser(userData);
          }
        } catch (error) {
          console.error('Error fetching client data:', error);
        }
      };
      
      fetchClientUser();
    }
  }, [project]);
  
  const handleUpdateProject = async (data) => {
    try {
      const response = await fetch(`/api/projects/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      
      if (!response.ok) {
        throw new Error('Failed to update project');
      }
      
      const updatedProject = await response.json();
      await mutate(updatedProject);
      setIsEditing(false);
      
      return updatedProject;
    } catch (error) {
      console.error('Error updating project:', error);
      throw error;
    }
  };
  
  const handleContactClient = () => {
    router.push(`/messages?recipient=${project.clientId}`);
  };
  
  const handleDeleteProject = async () => {
    if (!confirm('Are you sure you want to delete this project? This action cannot be undone.')) {
      return;
    }
    
    try {
      const response = await fetch(`/api/projects/${id}`, {
        method: 'DELETE'
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete project');
      }
      
      router.push('/projects');
    } catch (error) {
      console.error('Error deleting project:', error);
      alert('Failed to delete project. Please try again.');
    }
  };
  
  const handleUpdateStatus = async (newStatus) => {
    try {
      const response = await fetch(`/api/projects/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      
      if (!response.ok) {
        throw new Error('Failed to update project status');
      }
      
      const updatedProject = await response.json();
      await mutate(updatedProject);
    } catch (error) {
      console.error('Error updating project status:', error);
      alert('Failed to update project status. Please try again.');
    }
  };
  
  // Show loading state
  if (!project && !error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  // Show error state
  if (error || !project) {
    return (
      <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-md">
        <p>Error loading project. The project may have been removed or you don't have permission to view it.</p>
        <Link href="/projects" className="text-red-700 font-medium underline mt-2 inline-block">
          Return to Projects
        </Link>
      </div>
    );
  }
  
  // Show edit form if in editing mode
  if (isEditing) {
    return (
      <div>
        <div className="mb-6">
          <Link href={`/project/${id}`} className="text-blue-600 hover:underline flex items-center">
            <i className="fas fa-arrow-left mr-2"></i> Back to Project
          </Link>
        </div>
        
        <ProjectForm 
          project={project} 
          onSubmit={handleUpdateProject} 
          isEditing={true} 
        />
      </div>
    );
  }
  
  // Is current user the project owner
  const isOwner = user && project.clientId === user.id;
  
  return (
    <div>
      <div className="mb-6">
        <Link href="/projects" className="text-blue-600 hover:underline flex items-center">
          <i className="fas fa-arrow-left mr-2"></i> Back to Projects
        </Link>
      </div>
      
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {/* Project Header */}
        <div className="p-6 border-b">
          <div className="flex flex-wrap justify-between items-start">
            <div>
              <h1 className="text-2xl font-bold mb-2">{project.title}</h1>
              <div className="flex flex-wrap items-center text-gray-600 text-sm">
                <span className="mr-4">
                  <i className="fas fa-calendar mr-1"></i> Posted on {new Date(project.createdAt).toLocaleDateString()}
                </span>
                <span className="mr-4">
                  <i className="fas fa-tag mr-1"></i> {project.category}
                </span>
                <span>
                  <i className="fas fa-dollar-sign mr-1"></i> Budget: ${project.budget}
                </span>
              </div>
            </div>
            
            <div className="px-3 py-1 rounded-full text-sm font-medium uppercase" 
                 style={{ 
                   backgroundColor: project.status === 'open' ? '#e6f7ee' : 
                                   project.status === 'in_progress' ? '#e6f0ff' : 
                                   project.status === 'completed' ? '#e6e6e6' : '#ffede6',
                   color: project.status === 'open' ? '#0c864e' : 
                          project.status === 'in_progress' ? '#1a56db' : 
                          project.status === 'completed' ? '#4b5563' : '#cb4d00'
                 }}>
              {project.status === 'open' ? 'Open' : 
               project.status === 'in_progress' ? 'In Progress' : 
               project.status === 'completed' ? 'Completed' : 'Closed'}
            </div>
          </div>
        </div>
        
        {/* Project Details */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6">
          <div className="md:col-span-2">
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-3">Description</h2>
              <div className="text-gray-700 whitespace-pre-line">
                {project.description}
              </div>
            </div>
            
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-3">Required Skills</h2>
              <div className="flex flex-wrap gap-2">
                {project.skills && project.skills.map((skill, index) => (
                  <span key={index} className="bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
            
            {project.duration && (
              <div className="mb-6">
                <h2 className="text-xl font-semibold mb-3">Expected Duration</h2>
                <p className="text-gray-700">{project.duration}</p>
              </div>
            )}
          </div>
          
          <div>
            {/* Client Info */}
            <div className="bg-gray-50 p-4 rounded-lg mb-6">
              <h2 className="text-lg font-semibold mb-3">Client Information</h2>
              {clientUser ? (
                <div>
                  <div className="flex items-center mb-3">
                    <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-lg font-bold mr-3">
                      {clientUser.fullName ? clientUser.fullName.charAt(0).toUpperCase() : clientUser.username.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-medium">{clientUser.fullName || clientUser.username}</p>
                      <p className="text-gray-600 text-sm">Member since {new Date(clientUser.createdAt).toLocaleDateString(undefined, {
                        year: 'numeric',
                        month: 'long'
                      })}</p>
                    </div>
                  </div>
                  
                  <div className="mt-4">
                    {!isOwner && (
                      <button 
                        onClick={handleContactClient}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md transition-colors"
                      >
                        Contact Client
                      </button>
                    )}
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-center h-20">
                  <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-blue-500"></div>
                </div>
              )}
            </div>
            
            {/* Actions */}
            {isOwner && (
              <div className="bg-gray-50 p-4 rounded-lg">
                <h2 className="text-lg font-semibold mb-3">Actions</h2>
                <div className="space-y-3">
                  <Link
                    href={`/project/${id}?edit=true`}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md transition-colors block text-center"
                  >
                    Edit Project
                  </Link>
                  
                  <div className="relative">
                    <select
                      value={project.status}
                      onChange={(e) => handleUpdateStatus(e.target.value)}
                      className="w-full bg-white border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="open">Open</option>
                      <option value="in_progress">In Progress</option>
                      <option value="completed">Completed</option>
                      <option value="closed">Closed</option>
                    </select>
                  </div>
                  
                  <button 
                    onClick={handleDeleteProject}
                    className="w-full bg-red-100 hover:bg-red-200 text-red-600 py-2 rounded-md transition-colors"
                  >
                    Delete Project
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ProjectDetail() {
  return (
    <ProtectedRoute>
      <ProjectDetailPage />
    </ProtectedRoute>
  );
}
