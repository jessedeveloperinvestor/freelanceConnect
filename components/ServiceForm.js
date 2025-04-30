import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

export default function ServiceForm({ service, onSubmit, isEditing = false }) {
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    category: '',
    deliveryTime: ''
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Load service data if editing
  useEffect(() => {
    if (isEditing && service) {
      setFormData({
        title: service.title || '',
        description: service.description || '',
        price: service.price || '',
        category: service.category || '',
        deliveryTime: service.deliveryTime || ''
      });
    }
  }, [isEditing, service]);
  
  const categories = [
    'Web Development',
    'Mobile Development',
    'UI/UX Design',
    'Graphic Design',
    'Content Writing',
    'Translation',
    'Marketing',
    'SEO',
    'Data Entry',
    'Video Editing',
    'Voice Over',
    'Other'
  ];
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when field is edited
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };
  
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }
    
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }
    
    if (!formData.price) {
      newErrors.price = 'Price is required';
    } else if (isNaN(formData.price) || Number(formData.price) <= 0) {
      newErrors.price = 'Price must be a positive number';
    }
    
    if (!formData.category) {
      newErrors.category = 'Category is required';
    }
    
    if (!formData.deliveryTime) {
      newErrors.deliveryTime = 'Delivery time is required';
    } else if (isNaN(formData.deliveryTime) || Number(formData.deliveryTime) <= 0) {
      newErrors.deliveryTime = 'Delivery time must be a positive number';
    }
    
    return newErrors;
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Parse numeric values
      const serviceData = {
        ...formData,
        price: Number(formData.price),
        deliveryTime: Number(formData.deliveryTime)
      };
      
      await onSubmit(serviceData);
      
      // Redirect to services page on success
      router.push('/services');
    } catch (error) {
      console.error('Error submitting service:', error);
      setErrors({ submit: error.message || 'Failed to submit service. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleCancel = () => {
    router.back();
  };
  
  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-6">
        {isEditing ? 'Edit Service' : 'Create New Service'}
      </h2>
      
      {errors.submit && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
          {errors.submit}
        </div>
      )}
      
      <div className="mb-4">
        <label htmlFor="title" className="block text-gray-700 font-medium mb-2">
          Service Title*
        </label>
        <input
          type="text"
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            errors.title ? 'border-red-500' : 'border-gray-300'
          }`}
          placeholder="e.g., 'Professional Logo Design'"
        />
        {errors.title && (
          <p className="mt-1 text-red-500 text-sm">{errors.title}</p>
        )}
      </div>
      
      <div className="mb-4">
        <label htmlFor="description" className="block text-gray-700 font-medium mb-2">
          Service Description*
        </label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows="5"
          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            errors.description ? 'border-red-500' : 'border-gray-300'
          }`}
          placeholder="Describe your service in detail..."
        ></textarea>
        {errors.description && (
          <p className="mt-1 text-red-500 text-sm">{errors.description}</p>
        )}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div>
          <label htmlFor="price" className="block text-gray-700 font-medium mb-2">
            Price ($)*
          </label>
          <input
            type="number"
            id="price"
            name="price"
            value={formData.price}
            onChange={handleChange}
            min="1"
            step="1"
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.price ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="e.g., 50"
          />
          {errors.price && (
            <p className="mt-1 text-red-500 text-sm">{errors.price}</p>
          )}
        </div>
        
        <div>
          <label htmlFor="category" className="block text-gray-700 font-medium mb-2">
            Category*
          </label>
          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.category ? 'border-red-500' : 'border-gray-300'
            }`}
          >
            <option value="">Select a category</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
          {errors.category && (
            <p className="mt-1 text-red-500 text-sm">{errors.category}</p>
          )}
        </div>
        
        <div>
          <label htmlFor="deliveryTime" className="block text-gray-700 font-medium mb-2">
            Delivery Time (days)*
          </label>
          <input
            type="number"
            id="deliveryTime"
            name="deliveryTime"
            value={formData.deliveryTime}
            onChange={handleChange}
            min="1"
            step="1"
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.deliveryTime ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="e.g., 3"
          />
          {errors.deliveryTime && (
            <p className="mt-1 text-red-500 text-sm">{errors.deliveryTime}</p>
          )}
        </div>
      </div>
      
      <div className="flex justify-end space-x-3 mt-6">
        <button
          type="button"
          onClick={handleCancel}
          className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100 transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-70"
        >
          {isSubmitting ? 'Submitting...' : isEditing ? 'Update Service' : 'Create Service'}
        </button>
      </div>
    </form>
  );
}
