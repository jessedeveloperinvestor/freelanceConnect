import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import useSWR from 'swr';
import ProtectedRoute from '../../components/ProtectedRoute';
import ServiceForm from '../../components/ServiceForm';
import { useAuth } from '../../hooks/useAuth';

function ServiceDetailPage() {
  const { user } = useAuth();
  const router = useRouter();
  const { id, edit } = router.query;
  const [isEditing, setIsEditing] = useState(false);
  const [providerUser, setProviderUser] = useState(null);
  
  // Fetch service details
  const { data: service, error, mutate } = useSWR(id ? `/api/services/${id}` : null);
  
  // Set editing mode based on URL query
  useEffect(() => {
    setIsEditing(edit === 'true');
  }, [edit]);
  
  // Fetch provider information
  useEffect(() => {
    if (service && service.providerId) {
      const fetchProviderUser = async () => {
        try {
          const response = await fetch(`/api/user/${service.providerId}`);
          if (response.ok) {
            const userData = await response.json();
            setProviderUser(userData);
          }
        } catch (error) {
          console.error('Error fetching provider data:', error);
        }
      };
      
      fetchProviderUser();
    }
  }, [service]);
  
  const handleUpdateService = async (data) => {
    try {
      const response = await fetch(`/api/services/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      
      if (!response.ok) {
        throw new Error('Failed to update service');
      }
      
      const updatedService = await response.json();
      await mutate(updatedService);
      setIsEditing(false);
      
      return updatedService;
    } catch (error) {
      console.error('Error updating service:', error);
      throw error;
    }
  };
  
  const handleContactProvider = () => {
    router.push(`/messages?recipient=${service.providerId}`);
  };
  
  const handleDeleteService = async () => {
    if (!confirm('Are you sure you want to delete this service? This action cannot be undone.')) {
      return;
    }
    
    try {
      const response = await fetch(`/api/services/${id}`, {
        method: 'DELETE'
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete service');
      }
      
      router.push('/services');
    } catch (error) {
      console.error('Error deleting service:', error);
      alert('Failed to delete service. Please try again.');
    }
  };
  
  const handleUpdateStatus = async (newStatus) => {
    try {
      const response = await fetch(`/api/services/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      
      if (!response.ok) {
        throw new Error('Failed to update service status');
      }
      
      const updatedService = await response.json();
      await mutate(updatedService);
    } catch (error) {
      console.error('Error updating service status:', error);
      alert('Failed to update service status. Please try again.');
    }
  };
  
  // Show loading state
  if (!service && !error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  // Show error state
  if (error || !service) {
    return (
      <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-md">
        <p>Error loading service. The service may have been removed or you don't have permission to view it.</p>
        <Link href="/services" className="text-red-700 font-medium underline mt-2 inline-block">
          Return to Services
        </Link>
      </div>
    );
  }
  
  // Show edit form if in editing mode
  if (isEditing) {
    return (
      <div>
        <div className="mb-6">
          <Link href={`/service/${id}`} className="text-blue-600 hover:underline flex items-center">
            <i className="fas fa-arrow-left mr-2"></i> Back to Service
          </Link>
        </div>
        
        <ServiceForm 
          service={service} 
          onSubmit={handleUpdateService} 
          isEditing={true} 
        />
      </div>
    );
  }
  
  // Is current user the service provider
  const isOwner = user && service.providerId === user.id;
  
  return (
    <div>
      <div className="mb-6">
        <Link href="/services" className="text-blue-600 hover:underline flex items-center">
          <i className="fas fa-arrow-left mr-2"></i> Back to Services
        </Link>
      </div>
      
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {/* Service Header */}
        <div className="p-6 border-b">
          <div className="flex flex-wrap justify-between items-start">
            <div>
              <h1 className="text-2xl font-bold mb-2">{service.title}</h1>
              <div className="flex flex-wrap items-center text-gray-600 text-sm">
                <span className="mr-4">
                  <i className="fas fa-calendar mr-1"></i> Posted on {new Date(service.createdAt).toLocaleDateString()}
                </span>
                <span className="mr-4">
                  <i className="fas fa-tag mr-1"></i> {service.category}
                </span>
                <span>
                  <i className="fas fa-dollar-sign mr-1"></i> Price: ${service.price}
                </span>
              </div>
            </div>
            
            <div className="px-3 py-1 rounded-full text-sm font-medium uppercase" 
                 style={{ 
                   backgroundColor: service.status === 'active' ? '#e6f7ee' : '#ffede6',
                   color: service.status === 'active' ? '#0c864e' : '#cb4d00'
                 }}>
              {service.status === 'active' ? 'Active' : 'Inactive'}
            </div>
          </div>
        </div>
        
        {/* Service Details */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6">
          <div className="md:col-span-2">
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-3">Description</h2>
              <div className="text-gray-700 whitespace-pre-line">
                {service.description}
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold mb-2">Delivery Time</h3>
                <p className="text-gray-700">{service.deliveryTime} days</p>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold mb-2">Price</h3>
                <p className="text-gray-700 text-lg font-bold text-green-600">${service.price}</p>
              </div>
            </div>
          </div>
          
          <div>
            {/* Provider Info */}
            <div className="bg-gray-50 p-4 rounded-lg mb-6">
              <h2 className="text-lg font-semibold mb-3">Provider Information</h2>
              {providerUser ? (
                <div>
                  <div className="flex items-center mb-3">
                    <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-lg font-bold mr-3">
                      {providerUser.fullName ? providerUser.fullName.charAt(0).toUpperCase() : providerUser.username.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-medium">{providerUser.fullName || providerUser.username}</p>
                      <p className="text-gray-600 text-sm">Professional</p>
                    </div>
                  </div>
                  
                  {providerUser.skills && providerUser.skills.length > 0 && (
                    <div className="mt-3">
                      <p className="font-medium mb-1">Skills:</p>
                      <div className="flex flex-wrap gap-1">
                        {providerUser.skills.map((skill, index) => (
                          <span key={index} className="bg-blue-100 text-blue-800 text-xs px-2 py-0.5 rounded">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  <div className="mt-4">
                    {!isOwner && (
                      <button 
                        onClick={handleContactProvider}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md transition-colors"
                      >
                        Contact Provider
                      </button>
                    )}
                    <Link 
                      href={`/profile/${providerUser.id}`}
                      className="w-full mt-2 border border-blue-600 text-blue-600 hover:bg-blue-50 py-2 rounded-md transition-colors block text-center"
                    >
                      View Profile
                    </Link>
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
                    href={`/service/${id}?edit=true`}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md transition-colors block text-center"
                  >
                    Edit Service
                  </Link>
                  
                  <div className="relative">
                    <select
                      value={service.status}
                      onChange={(e) => handleUpdateStatus(e.target.value)}
                      className="w-full bg-white border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  </div>
                  
                  <button 
                    onClick={handleDeleteService}
                    className="w-full bg-red-100 hover:bg-red-200 text-red-600 py-2 rounded-md transition-colors"
                  >
                    Delete Service
                  </button>
                </div>
              </div>
            )}
            
            {!isOwner && (
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                <h3 className="font-medium text-blue-800 mb-2">Interested in this service?</h3>
                <p className="text-blue-700 text-sm mb-3">
                  Contact the provider to discuss your needs and get started.
                </p>
                <button 
                  onClick={handleContactProvider}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md transition-colors"
                >
                  Get Started
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ServiceDetail() {
  return (
    <ProtectedRoute>
      <ServiceDetailPage />
    </ProtectedRoute>
  );
}
