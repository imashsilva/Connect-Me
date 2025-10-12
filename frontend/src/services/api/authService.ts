import { User } from '../../types';
import { AuthResponse, LoginRequest, RegisterRequest } from '../../types/auth';
import api from './index';

export const authService = {
  login: async (credentials: LoginRequest): Promise<AuthResponse> => {
    try {
      console.log('🔐 Attempting login with:', { email: credentials.email });
      
      const response = await api.post('/auth/login', credentials);
      console.log('✅ Login response received:', response.data);
      
      if (response.data.success && response.data.data) {
        return response.data.data;
      } else {
        throw new Error(response.data.message || 'Login failed');
      }
      
    } catch (error: any) {
      console.error('❌ Login API error:', error);
      
      const errorMessage = error.response?.data?.message 
        || error.response?.data?.error
        || error.message 
        || 'Login failed';
      
      throw new Error(errorMessage);
    }
  },

  register: async (userData: RegisterRequest): Promise<AuthResponse> => {
    try {
      console.log('👤 Attempting registration with:', userData);
      
      const response = await api.post('/auth/register', userData);
      console.log('✅ Registration response received:', response.data);
      
      if (response.data.success && response.data.data) {
        return response.data.data;
      } else {
        throw new Error(response.data.message || 'Registration failed');
      }
      
    } catch (error: any) {
      console.error('❌ Registration API error:', error);
      
      const errorMessage = error.response?.data?.message 
        || error.response?.data?.error
        || error.message 
        || 'Registration failed';
      
      throw new Error(errorMessage);
    }
  },

  refreshToken: async (refreshToken: string): Promise<AuthResponse> => {
    try {
      const response = await api.post('/auth/refresh-token', { refreshToken });
      return response.data.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Token refresh failed');
    }
  },

  logout: async (): Promise<void> => {
    try {
      await api.post('/auth/logout');
    } catch (error: any) {
      console.error('Logout error:', error);
    }
  },

  getProfile: async (): Promise<User> => {
    try {
      const response = await api.get('/users/me');
      return response.data.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to fetch profile');
    }
  },

  updateProfile: async (profileData: {
    displayName?: string;
    phoneNumber?: string;
    profilePicture?: string;
    status?: string;
  }): Promise<User> => {
    try {
      const response = await api.put('/users/profile', profileData);
      return response.data.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to update profile');
    }
  },
};