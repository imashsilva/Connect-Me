import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_BASE_URL = 'https://corrie-variolitic-impolitely.ngrok-free.dev/Connect_Me/api';

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
      // Small delay to ensure token is available
      await new Promise(resolve => setTimeout(resolve, 50));
      
      const token = await AsyncStorage.getItem('userToken');
      console.log('🔑 Token from storage:', token);
      
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
        console.log('✅ Added Authorization header to:', config.url);
      } else {
        console.log('❌ No token found in storage for:', config.url);
      }
      
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

    return Promise.reject(error);
  }
);

export { api };
export default api;