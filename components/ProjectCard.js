import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useAuth } from '../hooks/useAuth';

export default function ProjectCard({ project, onDelete }) {
  const { user } = useAuth();
  const router = useRouter();
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  
  const handleMessageClient = () => {
    router.push(`/messages?recipient=${project.clientId}`);
  };
  
  const handleDelete = async () => {
    if (onDelete) {
      onDelete(project.id);
    }
    setShowConfirmDelete(false);
  };
  
  const isOwner = user && user.id === project.clientId;
  
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden transition-shadow hover:shadow-lg">
      <div className="p-6">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">{project.title}</h3>
            <p className="text-sm text-gray-500">Posted on {formatDate(project.createdAt)}</p>
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
        
        <p className="mt-3 text-gray-600 line-clamp-3">
          {project.description}
        </p>
        
        <div className="mt-4 flex flex-wrap gap-2">
          {project.skills.map((skill, index) => (
            <span key={index} className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
              {skill}
            </span>
          ))}
        </div>
        
        <div className="mt-4 flex justify-between items-center">
          <div>
            <span className="text-gray-700 font-medium">Budget:</span> 
            <span className="ml-1 text-green-600 font-bold">${project.budget}</span>
          </div>
          <div>
            <span className="text-gray-700 font-medium">Category:</span>
            <span className="ml-1 text-gray-600">{project.category}</span>
          </div>
        </div>
        
        <div className="mt-6">
          {isOwner ? (
            <div className="flex space-x-3">
              <Link href={`/project/${project.id}`} className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded text-center transition-colors">
                View Details
              </Link>
              <Link href={`/project/${project.id}?edit=true`} className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 px-4 rounded text-center transition-colors">
                Edit
              </Link>
              <button 
                onClick={() => setShowConfirmDelete(true)}
                className="flex-1 bg-red-100 hover:bg-red-200 text-red-600 py-2 px-4 rounded text-center transition-colors"
              >
                Delete
              </button>
            </div>
          ) : (
            <div className="flex space-x-3">
              <Link href={`/project/${project.id}`} className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded text-center transition-colors">
                View Details
              </Link>
              <button 
                onClick={handleMessageClient}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded text-center transition-colors"
              >
                Contact Client
              </button>
            </div>
          )}
        </div>
      </div>
      
      {/* Confirmation Modal */}
      {showConfirmDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full mx-4">
            <h3 className="text-lg font-bold mb-4">Confirm Deletion</h3>
            <p className="text-gray-700 mb-4">Are you sure you want to delete this project? This action cannot be undone.</p>
            <div className="flex justify-end space-x-3">
              <button 
                onClick={() => setShowConfirmDelete(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100 transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={handleDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
