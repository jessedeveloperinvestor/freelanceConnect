import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

export default function ProjectForm({ project, onSubmit, isEditing = false }) {
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    budget: '',
    category: '',
    skills: [],
    duration: ''
  });
  const [errors, setErrors] = useState({});
  const [skillInput, setSkillInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Load project data if editing
  useEffect(() => {
    if (isEditing && project) {
      setFormData({
        title: project.title || '',
        description: project.description || '',
        budget: project.budget || '',
        category: project.category || '',
        skills: project.skills || [],
        duration: project.duration || ''
      });
    }
  }, [isEditing, project]);
  
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
  
  const addSkill = () => {
    if (skillInput.trim() === '') return;
    
    if (!formData.skills.includes(skillInput.trim())) {
      setFormData(prev => ({
        ...prev,
        skills: [...prev.skills, skillInput.trim()]
      }));
    }
    
    setSkillInput('');
    
    // Clear skills error if it exists
    if (errors.skills) {
      setErrors(prev => ({ ...prev, skills: null }));
    }
  };
  
  const removeSkill = (skillToRemove) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.filter(skill => skill !== skillToRemove)
    }));
  };
  
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }
    
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }
    
    if (!formData.budget) {
      newErrors.budget = 'Budget is required';
    } else if (isNaN(formData.budget) || Number(formData.budget) <= 0) {
      newErrors.budget = 'Budget must be a positive number';
    }
    
    if (!formData.category) {
      newErrors.category = 'Category is required';
    }
    
    if (formData.skills.length === 0) {
      newErrors.skills = 'At least one skill is required';
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
      // Parse budget to number
      const projectData = {
        ...formData,
        budget: Number(formData.budget)
      };
      
      await onSubmit(projectData);
      
      // Redirect to projects page on success
      router.push('/projects');
    } catch (error) {
      console.error('Error submitting project:', error);
      setErrors({ submit: error.message || 'Failed to submit project. Please try again.' });
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
        {isEditing ? 'Edit Project' : 'Post New Project'}
      </h2>
      
      {errors.submit && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
          {errors.submit}
        </div>
      )}
      
      <div className="mb-4">
        <label htmlFor="title" className="block text-gray-700 font-medium mb-2">
          Project Title*
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
          placeholder="e.g., 'E-commerce Website Development'"
        />
        {errors.title && (
          <p className="mt-1 text-red-500 text-sm">{errors.title}</p>
        )}
      </div>
      
      <div className="mb-4">
        <label htmlFor="description" className="block text-gray-700 font-medium mb-2">
          Project Description*
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
          placeholder="Describe your project requirements in detail..."
        ></textarea>
        {errors.description && (
          <p className="mt-1 text-red-500 text-sm">{errors.description}</p>
        )}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label htmlFor="budget" className="block text-gray-700 font-medium mb-2">
            Budget ($)*
          </label>
          <input
            type="number"
            id="budget"
            name="budget"
            value={formData.budget}
            onChange={handleChange}
            min="1"
            step="1"
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.budget ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="e.g., 500"
          />
          {errors.budget && (
            <p className="mt-1 text-red-500 text-sm">{errors.budget}</p>
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
      </div>
      
      <div className="mb-4">
        <label htmlFor="duration" className="block text-gray-700 font-medium mb-2">
          Expected Duration
        </label>
        <input
          type="text"
          id="duration"
          name="duration"
          value={formData.duration}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="e.g., '2 weeks', '1 month'"
        />
      </div>
      
      <div className="mb-6">
        <label htmlFor="skills" className="block text-gray-700 font-medium mb-2">
          Required Skills*
        </label>
        <div className="flex">
          <input
            type="text"
            id="skills"
            value={skillInput}
            onChange={(e) => setSkillInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
            className={`flex-1 px-3 py-2 border rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.skills ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="e.g., React, Node.js"
          />
          <button
            type="button"
            onClick={addSkill}
            className="px-4 py-2 bg-blue-600 text-white rounded-r-md hover:bg-blue-700 transition-colors"
          >
            Add
          </button>
        </div>
        
        <div className="mt-2 flex flex-wrap gap-2">
          {formData.skills.map((skill) => (
            <div key={skill} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full flex items-center">
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
        
        {errors.skills && (
          <p className="mt-1 text-red-500 text-sm">{errors.skills}</p>
        )}
      </div>
      
      <div className="flex justify-end space-x-3">
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
          {isSubmitting ? 'Submitting...' : isEditing ? 'Update Project' : 'Post Project'}
        </button>
      </div>
    </form>
  );
}
