import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { AppNavigator } from './src/navigation/AppNavigator';
import { AuthProvider } from './src/contexts/AuthContext';
import { ChatProvider } from './src/contexts/ChatContext';
import { ThemeProvider } from './src/hooks/useTheme';

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <ChatProvider>
          <AppNavigator />
          <StatusBar style="auto" />
        </ChatProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}