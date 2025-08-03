import axios from 'axios';
import { cookies } from '../utils/cookies';

// Simple API configuration for student project
const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  withCredentials: true, // Enable cookies
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = cookies.get('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle responses
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear token if unauthorized
      cookies.delete('token');
      cookies.delete('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
