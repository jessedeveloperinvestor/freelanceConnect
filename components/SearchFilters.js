import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

export default function SearchFilters({ type }) {
  const router = useRouter();
  const [filters, setFilters] = useState({
    keyword: '',
    category: '',
    priceMin: '',
    priceMax: '',
    budgetMin: '',
    budgetMax: '',
    skills: []
  });
  const [skillInput, setSkillInput] = useState('');
  
  // Set initial values from URL query parameters
  useEffect(() => {
    const { 
      keyword, 
      category, 
      price, 
      budget,
      skills: skillsQuery
    } = router.query;
    
    const newFilters = { ...filters };
    
    if (keyword) newFilters.keyword = keyword;
    if (category) newFilters.category = category;
    
    if (price) {
      const [min, max] = price.split('-');
      if (min) newFilters.priceMin = min;
      if (max) newFilters.priceMax = max;
    }
    
    if (budget) {
      const [min, max] = budget.split('-');
      if (min) newFilters.budgetMin = min;
      if (max) newFilters.budgetMax = max;
    }
    
    if (skillsQuery) {
      newFilters.skills = Array.isArray(skillsQuery) 
        ? skillsQuery 
        : [skillsQuery];
    }
    
    setFilters(newFilters);
  }, [router.query]);
  
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
    setFilters(prev => ({ ...prev, [name]: value }));
  };
  
  const addSkill = () => {
    if (skillInput.trim() === '') return;
    
    if (!filters.skills.includes(skillInput.trim())) {
      setFilters(prev => ({
        ...prev,
        skills: [...prev.skills, skillInput.trim()]
      }));
    }
    
    setSkillInput('');
  };
  
  const removeSkill = (skillToRemove) => {
    setFilters(prev => ({
      ...prev,
      skills: prev.skills.filter(skill => skill !== skillToRemove)
    }));
  };
  
  const applyFilters = () => {
    const query = { type };
    
    if (filters.keyword) query.keyword = filters.keyword;
    if (filters.category) query.category = filters.category;
    
    // Construct price or budget range
    if (type === 'services' && (filters.priceMin || filters.priceMax)) {
      query.price = `${filters.priceMin || ''}-${filters.priceMax || ''}`;
    } else if (type === 'projects' && (filters.budgetMin || filters.budgetMax)) {
      query.budget = `${filters.budgetMin || ''}-${filters.budgetMax || ''}`;
    }
    
    // Add skills
    if (filters.skills.length > 0) {
      query.skills = filters.skills;
    }
    
    router.push({
      pathname: '/search',
      query
    });
  };
  
  const clearFilters = () => {
    setFilters({
      keyword: '',
      category: '',
      priceMin: '',
      priceMax: '',
      budgetMin: '',
      budgetMax: '',
      skills: []
    });
    
    router.push({
      pathname: '/search',
      query: { type }
    });
  };
  
  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-6">
      <h3 className="text-lg font-semibold mb-4">Filter {type === 'projects' ? 'Projects' : type === 'services' ? 'Services' : 'Professionals'}</h3>
      
      <div className="space-y-4">
        {/* Keyword Search */}
        <div>
          <label htmlFor="keyword" className="block text-sm font-medium text-gray-700 mb-1">
            Keyword
          </label>
          <input
            type="text"
            id="keyword"
            name="keyword"
            value={filters.keyword}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Search by keyword..."
          />
        </div>
        
        {/* Category */}
        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
            Category
          </label>
          <select
            id="category"
            name="category"
            value={filters.category}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Categories</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>
        
        {/* Price Range (for Services) */}
        {type === 'services' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Price Range ($)
            </label>
            <div className="flex space-x-2">
              <input
                type="number"
                name="priceMin"
                value={filters.priceMin}
                onChange={handleChange}
                min="0"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Min"
              />
              <span className="flex items-center text-gray-500">-</span>
              <input
                type="number"
                name="priceMax"
                value={filters.priceMax}
                onChange={handleChange}
                min="0"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Max"
              />
            </div>
          </div>
        )}
        
        {/* Budget Range (for Projects) */}
        {type === 'projects' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Budget Range ($)
            </label>
            <div className="flex space-x-2">
              <input
                type="number"
                name="budgetMin"
                value={filters.budgetMin}
                onChange={handleChange}
                min="0"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Min"
              />
              <span className="flex items-center text-gray-500">-</span>
              <input
                type="number"
                name="budgetMax"
                value={filters.budgetMax}
                onChange={handleChange}
                min="0"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Max"
              />
            </div>
          </div>
        )}
        
        {/* Skills (for Professionals or Projects) */}
        {(type === 'professionals' || type === 'projects') && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Skills
            </label>
            <div className="flex">
              <input
                type="text"
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                className="flex-1 px-3 py-2 border rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500 border-gray-300"
                placeholder="Add a skill..."
              />
              <button
                type="button"
                onClick={addSkill}
                className="px-3 py-2 bg-blue-600 text-white rounded-r-md hover:bg-blue-700 transition-colors"
              >
                Add
              </button>
            </div>
            
            {filters.skills.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-2">
                {filters.skills.map((skill) => (
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
            )}
          </div>
        )}
        
        <div className="flex space-x-3 pt-2">
          <button
            type="button"
            onClick={applyFilters}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded transition-colors"
          >
            Apply Filters
          </button>
          <button
            type="button"
            onClick={clearFilters}
            className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 rounded transition-colors"
          >
            Clear Filters
          </button>
        </div>
      </div>
    </div>
  );
}
