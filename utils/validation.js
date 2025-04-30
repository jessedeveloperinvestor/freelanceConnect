// User validation
export const validateUser = (data) => {
  const errors = {};
  
  if (!data.username) {
    errors.username = 'Username is required';
  } else if (data.username.length < 3) {
    errors.username = 'Username must be at least 3 characters';
  }
  
  if (!data.email) {
    errors.email = 'Email is required';
  } else if (!/\S+@\S+\.\S+/.test(data.email)) {
    errors.email = 'Email is invalid';
  }
  
  if (!data.password) {
    errors.password = 'Password is required';
  } else if (data.password.length < 6) {
    errors.password = 'Password must be at least 6 characters';
  }
  
  if (!data.role) {
    errors.role = 'Role is required';
  } else if (!['client', 'professional'].includes(data.role)) {
    errors.role = 'Role must be either client or professional';
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

// Login validation
export const validateLogin = (data) => {
  const errors = {};
  
  if (!data.email) {
    errors.email = 'Email is required';
  }
  
  if (!data.password) {
    errors.password = 'Password is required';
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

// Project validation
export const validateProject = (data) => {
  const errors = {};
  
  if (!data.title) {
    errors.title = 'Title is required';
  }
  
  if (!data.description) {
    errors.description = 'Description is required';
  }
  
  if (!data.budget && data.budget !== 0) {
    errors.budget = 'Budget is required';
  } else if (isNaN(Number(data.budget)) || Number(data.budget) < 0) {
    errors.budget = 'Budget must be a positive number';
  }
  
  if (!data.category) {
    errors.category = 'Category is required';
  }
  
  if (!data.skills || !Array.isArray(data.skills) || data.skills.length === 0) {
    errors.skills = 'At least one skill is required';
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

// Service validation
export const validateService = (data) => {
  const errors = {};
  
  if (!data.title) {
    errors.title = 'Title is required';
  }
  
  if (!data.description) {
    errors.description = 'Description is required';
  }
  
  if (!data.price && data.price !== 0) {
    errors.price = 'Price is required';
  } else if (isNaN(Number(data.price)) || Number(data.price) < 0) {
    errors.price = 'Price must be a positive number';
  }
  
  if (!data.category) {
    errors.category = 'Category is required';
  }
  
  if (!data.deliveryTime) {
    errors.deliveryTime = 'Delivery time is required';
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

// Message validation
export const validateMessage = (data) => {
  const errors = {};
  
  if (!data.content) {
    errors.content = 'Message content is required';
  }
  
  if (!data.senderId) {
    errors.senderId = 'Sender ID is required';
  }
  
  if (!data.recipientId) {
    errors.recipientId = 'Recipient ID is required';
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

// Profile validation
export const validateProfile = (data) => {
  const errors = {};
  
  if (!data.fullName) {
    errors.fullName = 'Full name is required';
  }
  
  if (data.role === 'professional') {
    if (!data.bio) {
      errors.bio = 'Bio is required for professionals';
    }
    
    if (!data.skills || !Array.isArray(data.skills) || data.skills.length === 0) {
      errors.skills = 'At least one skill is required for professionals';
    }
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};
