import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// CORRECT BASE URL - Found from testing
const API_BASE_URL = 'https://corrie-variolitic-impolitely.ngrok-free.dev/Connect_Me/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  async (config) => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      
      // Log the request
      console.log('🚀 Making API request:', {
        method: config.method?.toUpperCase(),
        url: config.url,
        data: config.data,
      });
      
    } catch (error) {
      console.error('Error getting token from storage:', error);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    console.log('✅ API Response success:', {
      status: response.status,
      url: response.config.url,
      data: response.data
    });
    return response;
  },
  async (error) => {
    console.error('❌ API Response error:', {
      status: error.response?.status,
      url: error.config?.url,
      data: error.response?.data,
      message: error.message
    });

    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        const refreshToken = await AsyncStorage.getItem('refreshToken');
        if (refreshToken) {
          // Try to refresh token
          const response = await api.post('/auth/refresh-token', { refreshToken });
          const { token, refreshToken: newRefreshToken } = response.data;
          
          await AsyncStorage.setItem('userToken', token);
          await AsyncStorage.setItem('refreshToken', newRefreshToken);
          
          // Retry original request
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return api(originalRequest);
        }
      } catch (refreshError) {
        // Refresh failed, redirect to login
        await AsyncStorage.multiRemove(['userToken', 'refreshToken', 'userData']);
      }
    }

    return Promise.reject(error);
  }
);

export { api };
export default api;