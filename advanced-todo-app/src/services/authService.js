import axios from 'axios';

// Backend API base URL
const API_BASE_URL = 'http://localhost:4000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Authentication service
export const authService = {
  async login(email, password) {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  },

  async register(userData) {
    const response = await api.post('/auth/register', {
      name: userData.fullName,
      email: userData.email,
      password: userData.password
    });
    return response.data;
  },

  async getCurrentUser(token) {
    const response = await api.get('/auth/me', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    return {
      id: response.data.id,
      name: response.data.name,
      email: response.data.email
    };
  },
};

export default authService;