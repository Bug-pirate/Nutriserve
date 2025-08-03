import api from './api';
import { cookies } from '../utils/cookies';

export const authService = {
  // Login user
  login: async (email, password) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      const { token, user } = response.data;
      
      // Store in cookies instead of localStorage
      cookies.set('token', token, 7); // 7 days
      cookies.set('user', JSON.stringify(user), 7);
      
      return { success: true, data: { token, user } };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Login failed'
      };
    }
  },

  // Register user
  register: async (userData) => {
    try {
      const response = await api.post('/auth/signup', userData);
      const { token, user } = response.data;
      
      // Store in cookies instead of localStorage
      cookies.set('token', token, 7); // 7 days
      cookies.set('user', JSON.stringify(user), 7);
      
      return { success: true, data: { token, user } };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Registration failed'
      };
    }
  },

  // Logout
  logout: () => {
    cookies.delete('token');
    cookies.delete('user');
    window.location.href = '/login';
  },

  // Check if user is authenticated
  isAuthenticated: () => {
    return !!cookies.get('token');
  },

  // Get stored user
  getStoredUser: () => {
    const user = cookies.get('user');
    return user ? JSON.parse(user) : null;
  }
};
