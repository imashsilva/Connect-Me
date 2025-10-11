import { User } from '../../types';
import { AuthResponse, LoginRequest, RegisterRequest } from '../../types/auth';
import api from './index';
//import { LoginRequest, RegisterRequest, AuthResponse, User } from '../../types';

export const authService = {
  /**
   * Login user with email and password
   */
  login: async (credentials: LoginRequest): Promise<AuthResponse> => {
    try {
      console.log('🔐 Attempting login with:', { email: credentials.email });
      
      const response = await api.post('/auth/login', credentials);
      console.log('✅ Login response received');
      
      // Return the response data directly
      return response.data;
      
    } catch (error: any) {
      console.error('❌ Login API error:', error);
      
      const errorMessage = error.response?.data?.message 
        || error.response?.data 
        || error.message 
        || 'Login failed';
      
      throw new Error(errorMessage);
    }
  },

  /**
   * Register a new user
   */
  register: async (userData: RegisterRequest): Promise<AuthResponse> => {
    try {
      console.log('👤 Attempting registration with:', userData);
      
      const response = await api.post('/auth/register', userData);
      console.log('✅ Registration response received');
      
      return response.data;
      
    } catch (error: any) {
      console.error('❌ Registration API error:', error);
      
      const errorMessage = error.response?.data?.message 
        || error.response?.data 
        || error.message 
        || 'Registration failed';
      
      throw new Error(errorMessage);
    }
  },

  /**
   * Refresh access token using refresh token
   */
  refreshToken: async (refreshToken: string): Promise<AuthResponse> => {
    try {
      const response = await api.post('/auth/refresh-token', { refreshToken });
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Token refresh failed');
    }
  },

  /**
   * Logout user
   */
  logout: async (): Promise<void> => {
    try {
      await api.post('/auth/logout');
    } catch (error: any) {
      console.error('Logout error:', error);
    }
  },

  /**
   * Get current user profile
   */
  getProfile: async (): Promise<User> => {
    try {
      const response = await api.get('/users/me');
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to fetch profile');
    }
  },

  /**
   * Update user profile
   */
  updateProfile: async (profileData: {
    displayName?: string;
    phoneNumber?: string;
    profilePicture?: string;
    status?: string;
  }): Promise<User> => {
    try {
      const response = await api.put('/users/profile', profileData);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to update profile');
    }
  },
};