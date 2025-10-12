import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { authService } from '../services/api/authService';
import { socketService } from '../services/socket';
import { User } from '../types';
import { AuthResponse, LoginRequest, RegisterRequest } from '../types/auth';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (credentials: LoginRequest) => Promise<{ success: boolean; error?: string }>;
  register: (userData: RegisterRequest) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  updateUser: (userData: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkAuthState();
  }, []);

  const checkAuthState = async () => {
    try {
      const storedToken = await AsyncStorage.getItem('userToken');
      const storedUser = await AsyncStorage.getItem('userData');

      console.log('🔄 Checking auth state - Token:', !!storedToken, 'User:', !!storedUser);

      if (storedToken && storedUser) {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
        
        await socketService.connect();
      }
    } catch (error) {
      console.error('Error checking auth state:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (credentials: LoginRequest): Promise<{ success: boolean; error?: string }> => {
    try {
      setIsLoading(true);
      const authResponse: AuthResponse = await authService.login(credentials);
      
      console.log('💾 Storing token and user data...');
      
      // Store data first
      await AsyncStorage.multiSet([
        ['userToken', authResponse.token],
        ['userData', JSON.stringify(authResponse.user)],
      ]);

      console.log('✅ Data stored, updating state...');
      
      // Then update state
      setToken(authResponse.token);
      setUser(authResponse.user);

      // Wait a moment for state to update
      await new Promise(resolve => setTimeout(resolve, 100));
      
      console.log('✅ Login completed, token:', authResponse.token);
      
      await socketService.connect();

      return { success: true };
    } catch (error: any) {
      console.error('Login error:', error);
      return { success: false, error: error.message };
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData: RegisterRequest): Promise<{ success: boolean; error?: string }> => {
    try {
      setIsLoading(true);
      const authResponse: AuthResponse = await authService.register(userData);
      
      await AsyncStorage.multiSet([
        ['userToken', authResponse.token],
        ['userData', JSON.stringify(authResponse.user)],
      ]);

      setToken(authResponse.token);
      setUser(authResponse.user);

      await new Promise(resolve => setTimeout(resolve, 100));
      
      await socketService.connect();

      return { success: true };
    } catch (error: any) {
      console.error('Registration error:', error);
      return { success: false, error: error.message };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    try {
      if (token) {
        await authService.logout();
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      await AsyncStorage.multiRemove(['userToken', 'refreshToken', 'userData']);
      setToken(null);
      setUser(null);
      
      socketService.disconnect();
    }
  };

  const updateUser = (userData: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...userData };
      setUser(updatedUser);
      AsyncStorage.setItem('userData', JSON.stringify(updatedUser));
    }
  };

  const value: AuthContextType = {
    user,
    token,
    isLoading,
    isAuthenticated: !!token && !!user,
    login,
    register,
    logout,
    updateUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};