import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useAuth } from '../hooks/useAuth';

export default function ServiceCard({ service, onDelete }) {
  const { user } = useAuth();
  const router = useRouter();
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  
  const handleMessageProvider = () => {
    router.push(`/messages?recipient=${service.providerId}`);
  };
  
  const handleDelete = async () => {
    if (onDelete) {
      onDelete(service.id);
    }
    setShowConfirmDelete(false);
  };
  
  const isOwner = user && user.id === service.providerId;
  
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden transition-shadow hover:shadow-lg">
      <div className="p-6">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">{service.title}</h3>
            <p className="text-sm text-gray-500">Posted on {formatDate(service.createdAt)}</p>
          </div>
          <div className="px-3 py-1 rounded-full text-sm font-medium uppercase" 
               style={{ 
                 backgroundColor: service.status === 'active' ? '#e6f7ee' : '#ffede6',
                 color: service.status === 'active' ? '#0c864e' : '#cb4d00'
               }}>
            {service.status === 'active' ? 'Active' : 'Inactive'}
          </div>
        </div>
        
        <p className="mt-3 text-gray-600 line-clamp-3">
          {service.description}
        </p>
        
        <div className="mt-4 flex justify-between items-center">
          <div>
            <span className="text-gray-700 font-medium">Price:</span> 
            <span className="ml-1 text-green-600 font-bold">${service.price}</span>
          </div>
          <div>
            <span className="text-gray-700 font-medium">Category:</span>
            <span className="ml-1 text-gray-600">{service.category}</span>
          </div>
        </div>
        
        <div className="mt-2 flex justify-between items-center">
          <div>
            <span className="text-gray-700 font-medium">Delivery Time:</span> 
            <span className="ml-1 text-gray-600">{service.deliveryTime} days</span>
          </div>
        </div>
        
        <div className="mt-6">
          {isOwner ? (
            <div className="flex space-x-3">
              <Link href={`/service/${service.id}`} className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded text-center transition-colors">
                View Details
              </Link>
              <Link href={`/service/${service.id}?edit=true`} className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 px-4 rounded text-center transition-colors">
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
              <Link href={`/service/${service.id}`} className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded text-center transition-colors">
                View Details
              </Link>
              <button 
                onClick={handleMessageProvider}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded text-center transition-colors"
              >
                Contact Provider
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
            <p className="text-gray-700 mb-4">Are you sure you want to delete this service? This action cannot be undone.</p>
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
