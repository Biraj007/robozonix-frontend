import api from './api';

// Auth API endpoints
export const authAPI = {
  // Register new user
  register: async (userData) => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },

  // Login user
  login: async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  },

  // Get current user
  getMe: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  },
};

// User API endpoints (for future use)
export const userAPI = {
  // Get user profile
  getProfile: async () => {
    const response = await api.get('/users/profile');
    return response.data;
  },

  // Update user profile
  updateProfile: async (userData) => {
    const response = await api.put('/users/profile', userData);
    return response.data;
  },
};

// Projects API endpoints (for future use)
export const projectsAPI = {
  // Get all projects
  getAll: async () => {
    const response = await api.get('/projects');
    return response.data;
  },

  // Get single project
  getById: async (id) => {
    const response = await api.get(`/projects/${id}`);
    return response.data;
  },
};

// Events API endpoints (for future use)
export const eventsAPI = {
  // Get all events
  getAll: async () => {
    const response = await api.get('/events');
    return response.data;
  },

  // Get upcoming events
  getUpcoming: async () => {
    const response = await api.get('/events/upcoming');
    return response.data;
  },
};

// Contact API endpoints
export const contactAPI = {
  // Submit contact form
  submit: async (formData) => {
    const response = await api.post('/contact', formData);
    return response.data;
  },
};
