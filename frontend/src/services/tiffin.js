import api from './api';

export const tiffinService = {
  // Get all users with their deliveries (Admin)
  getAllUsers: async (month, year) => {
    try {
      const params = {};
      if (month) params.month = month;
      if (year) params.year = year;

      const response = await api.get('/tiffin/admin/all-users', { params });
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to fetch users'
      };
    }
  },

  // Mark delivery status (Admin)
  markDelivery: async (userId, date, morningDelivered, eveningDelivered) => {
    try {
      const response = await api.post('/tiffin/admin/mark-delivery', {
        userId,
        date,
        morningDelivered,
        eveningDelivered
      });
      
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Mark delivery API error:', error);
      return {
        success: false,
        error: error.response?.data?.message || error.message || 'Failed to update delivery'
      };
    }
  },

  // Generate monthly bill (Admin)
  generateBill: async (userId, month, year) => {
    try {
      const response = await api.post('/tiffin/admin/generate-monthly-bill', {
        userId,
        month,
        year
      });
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to generate bill'
      };
    }
  },

  // Get settings (Admin)
  getSettings: async () => {
    try {
      const response = await api.get('/tiffin/admin/settings');
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to fetch settings'
      };
    }
  },

  // Update settings (Admin)
  updateSettings: async (settings) => {
    try {
      const response = await api.put('/tiffin/admin/settings', settings);
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to update settings'
      };
    }
  },

  // Get user's own deliveries
  getUserDeliveries: async (month, year) => {
    try {
      const params = {};
      if (month) params.month = month;
      if (year) params.year = year;

      const response = await api.get('/tiffin/user-deliveries', { params });
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to fetch deliveries'
      };
    }
  },

};
