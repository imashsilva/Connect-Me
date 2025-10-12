import React, { createContext, useContext, ReactNode } from 'react';
import { useColorScheme } from 'react-native';
import { useState, useEffect } from 'react';

export interface ThemeColors {
  // Brand Colors
  primary: string;
  secondary: string;
  
  // Background Colors
  background: string;
  card: string;
  
  // Text Colors
  text: string;
  subtitle: string;
  caption: string;
  
  // UI Colors
  border: string;
  notification: string;
  success: string;
  warning: string;
  error: string;
  info: string;
  
  // State Colors
  disabled: string;
  placeholder: string;
  
  // Gradient Colors (for backgrounds)
  gradient: {
    start: string;
    end: string;
  };
}

interface ThemeContextType {
  // State
  theme: 'light' | 'dark';
  colors: ThemeColors;
  isDark: boolean;
  isSystemTheme: boolean;
  
  // Actions
  toggleTheme: () => void;
  setSystemTheme: () => void;
  setLightTheme: () => void;
  setDarkTheme: () => void;
  
  // Helpers
  getGradientColors: () => string[];
  getChatBubbleColors: () => {
    sent: string;
    received: string;
    text: {
      sent: string;
      received: string;
    };
  };
  getStatusColors: (status: 'online' | 'offline' | 'away' | 'busy') => string;
  
  // Constants
  spacing: {
    xs: number;
    sm: number;
    md: number;
    lg: number;
    xl: number;
    xxl: number;
  };
  borderRadius: {
    sm: number;
    md: number;
    lg: number;
    xl: number;
    full: number;
  };
  typography: {
    xs: number;
    sm: number;
    base: number;
    lg: number;
    xl: number;
    '2xl': number;
    '3xl': number;
    '4xl': number;
  };
}

// Create Context
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// Theme Provider Component
interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const systemTheme = useColorScheme();
  const [theme, setTheme] = useState<'light' | 'dark'>(systemTheme || 'light');
  const [isSystemTheme, setIsSystemTheme] = useState(true);

  useEffect(() => {
    if (systemTheme) {
      setTheme(systemTheme);
    }
  }, [systemTheme]);

  const lightColors: ThemeColors = {
    // Brand Colors
    primary: '#2563EB',
    secondary: '#10B981',
    
    // Background Colors
    background: '#FFFFFF',
    card: '#F9FAFB',
    
    // Text Colors
    text: '#1F2937',
    subtitle: '#6B7280',
    caption: '#9CA3AF',
    
    // UI Colors
    border: '#E5E7EB',
    notification: '#EF4444',
    success: '#10B981',
    warning: '#F59E0B',
    error: '#EF4444',
    info: '#3B82F6',
    
    // State Colors
    disabled: '#D1D5DB',
    placeholder: '#9CA3AF',
    
    // Gradient Colors
    gradient: {
      start: '#2563EB',
      end: '#3B82F6',
    },
  };

  const darkColors: ThemeColors = {
    // Brand Colors
    primary: '#3B82F6',
    secondary: '#10B981',
    
    // Background Colors
    background: '#111827',
    card: '#1F2937',
    
    // Text Colors
    text: '#F9FAFB',
    subtitle: '#D1D5DB',
    caption: '#9CA3AF',
    
    // UI Colors
    border: '#374151',
    notification: '#EF4444',
    success: '#10B981',
    warning: '#F59E0B',
    error: '#EF4444',
    info: '#3B82F6',
    
    // State Colors
    disabled: '#4B5563',
    placeholder: '#6B7280',
    
    // Gradient Colors
    gradient: {
      start: '#1e3a8a',
      end: '#0f172a',
    },
  };

  const colors = theme === 'dark' ? darkColors : lightColors;

  const toggleTheme = () => {
    setTheme(prev => {
      const newTheme = prev === 'light' ? 'dark' : 'light';
      setIsSystemTheme(false);
      return newTheme;
    });
  };

  const setSystemTheme = () => {
    if (systemTheme) {
      setTheme(systemTheme);
      setIsSystemTheme(true);
    }
  };

  const setLightTheme = () => {
    setTheme('light');
    setIsSystemTheme(false);
  };

  const setDarkTheme = () => {
    setTheme('dark');
    setIsSystemTheme(false);
  };

  // Helper function for gradient backgrounds
  const getGradientColors = (): string[] => {
    return theme === 'dark' 
      ? ['#1e3a8a', '#0f172a'] 
      : ['#2563EB', '#3B82F6'];
  };

  // Helper function for chat bubble colors
  const getChatBubbleColors = () => {
    return theme === 'dark'
      ? {
          sent: '#1E40AF',
          received: '#374151',
          text: {
            sent: '#FFFFFF',
            received: '#F9FAFB',
          },
        }
      : {
          sent: '#DCF8C6',
          received: '#FFFFFF',
          text: {
            sent: '#1F2937',
            received: '#1F2937',
          },
        };
  };

  // Helper function for status colors
  const getStatusColors = (status: 'online' | 'offline' | 'away' | 'busy') => {
    const statusColors = {
      online: '#10B981',
      offline: '#6B7280',
      away: '#F59E0B',
      busy: '#EF4444',
    };
    
    return statusColors[status];
  };

  const value: ThemeContextType = {
    // State
    theme,
    colors,
    isDark: theme === 'dark',
    isSystemTheme,
    
    // Actions
    toggleTheme,
    setSystemTheme,
    setLightTheme,
    setDarkTheme,
    
    // Helpers
    getGradientColors,
    getChatBubbleColors,
    getStatusColors,
    
    // Constants
    spacing: {
      xs: 4,
      sm: 8,
      md: 16,
      lg: 24,
      xl: 32,
      xxl: 48,
    },
    
    borderRadius: {
      sm: 8,
      md: 12,
      lg: 16,
      xl: 24,
      full: 9999,
    },
    
    typography: {
      xs: 12,
      sm: 14,
      base: 16,
      lg: 18,
      xl: 20,
      '2xl': 24,
      '3xl': 30,
      '4xl': 36,
    },
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

// Hook to use theme
export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

// Export type for component props
export type ThemeProps = {
  theme: ThemeContextType;
};