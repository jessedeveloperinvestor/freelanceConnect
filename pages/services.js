import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import useSWR from 'swr';
import ProtectedRoute from '../components/ProtectedRoute';
import ServiceCard from '../components/ServiceCard';
import { useAuth } from '../hooks/useAuth';

function ServicesPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('all');
  const [filteredServices, setFilteredServices] = useState([]);
  
  // Fetch user's services
  const { data: services, error, mutate } = useSWR(
    user?.id ? `/api/services?providerId=${user.id}` : null
  );
  
  // Filter services based on active tab
  useEffect(() => {
    if (!services) return;
    
    if (activeTab === 'all') {
      setFilteredServices(services);
    } else {
      setFilteredServices(services.filter(service => service.status === activeTab));
    }
  }, [activeTab, services]);
  
  const handleDeleteService = async (serviceId) => {
    try {
      const response = await fetch(`/api/services/${serviceId}`, {
        method: 'DELETE'
      });
      
      if (response.ok) {
        // Remove the deleted service from the list
        mutate(services.filter(service => service.id !== serviceId), false);
      } else {
        console.error('Failed to delete service');
      }
    } catch (error) {
      console.error('Error deleting service:', error);
    }
  };
  
  if (error) {
    return (
      <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6">
        <p>Error loading services. Please try again later.</p>
      </div>
    );
  }
  
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">My Services</h1>
        <Link href="/services/new" className="btn btn-primary">
          <i className="fas fa-plus mr-2"></i> New Service
        </Link>
      </div>
      
      {/* Service Tabs */}
      <div className="bg-white rounded-lg shadow-md mb-6 overflow-hidden">
        <div className="flex border-b overflow-x-auto">
          <button 
            onClick={() => setActiveTab('all')}
            className={`px-6 py-3 text-gray-700 font-medium whitespace-nowrap ${activeTab === 'all' ? 'border-b-2 border-blue-600 text-blue-600' : ''}`}
          >
            All Services
          </button>
          <button 
            onClick={() => setActiveTab('active')}
            className={`px-6 py-3 text-gray-700 font-medium whitespace-nowrap ${activeTab === 'active' ? 'border-b-2 border-blue-600 text-blue-600' : ''}`}
          >
            Active
          </button>
          <button 
            onClick={() => setActiveTab('inactive')}
            className={`px-6 py-3 text-gray-700 font-medium whitespace-nowrap ${activeTab === 'inactive' ? 'border-b-2 border-blue-600 text-blue-600' : ''}`}
          >
            Inactive
          </button>
        </div>
      </div>
      
      {/* Services List */}
      {!services ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : services.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <i className="fas fa-concierge-bell text-gray-400 text-5xl mb-4"></i>
          <h3 className="text-xl font-semibold mb-2">No services yet</h3>
          <p className="text-gray-600 mb-6">
            You haven't created any services yet. Create your first service to get started.
          </p>
          <Link href="/services/new" className="btn btn-primary px-8 py-3">
            Create a Service
          </Link>
        </div>
      ) : filteredServices.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <i className="fas fa-filter text-gray-400 text-5xl mb-4"></i>
          <h3 className="text-xl font-semibold mb-2">No matching services</h3>
          <p className="text-gray-600 mb-6">
            You don't have any services with the selected status.
          </p>
          <button 
            onClick={() => setActiveTab('all')}
            className="btn btn-primary px-8 py-3"
          >
            Show All Services
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredServices.map(service => (
            <ServiceCard 
              key={service.id} 
              service={service} 
              onDelete={handleDeleteService}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default function Services() {
  return (
    <ProtectedRoute>
      <ServicesPage />
    </ProtectedRoute>
  );
}
