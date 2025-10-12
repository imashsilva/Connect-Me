import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

// Import your screens
import { SplashScreen } from '../screens/common/SplashScreen';
import { WelcomeScreen } from '../screens/auth/WelcomeScreen';
import { LoginScreen } from '../screens/auth/LoginScreen';
import { RegisterScreen } from '../screens/auth/RegisterScreen';
import { ChatListScreen } from '../screens/chat/ChatListScreen';
import { ChatScreen } from '../screens/chat/ChatScreen';
import { ProfileScreen } from '../screens/settings/ProfileScreen';
import { ContactsScreen } from '../screens/contacts/ContactsScreen';
import { IncomingCallScreen } from '../components/calls/IncomingCallScreen';
import { OngoingCallScreen } from '../screens/calls/OngoingCallScreen';
import { CallHistoryScreen } from '../screens/calls/CallHistoryScreen';
import { AuthStackParamList, MainTabParamList, RootStackParamList } from './type';
import { useAuth } from '../contexts/AuthContext';
import { LoadingScreen } from '../components/common/LoadingScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();
const AuthStack = createNativeStackNavigator<AuthStackParamList>();
const Tab = createBottomTabNavigator<MainTabParamList>();

// Auth Navigator
const AuthNavigator = () => (
  <AuthStack.Navigator screenOptions={{ headerShown: false }}>
    <AuthStack.Screen name="Login" component={LoginScreen} />
    <AuthStack.Screen name="Register" component={RegisterScreen} />
  </AuthStack.Navigator>
);

// Main Tab Navigator
const MainTabNavigator = () => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      tabBarIcon: ({ focused, color, size }) => {
        let iconName: keyof typeof Ionicons.glyphMap;

        if (route.name === 'Chats') {
          iconName = focused ? 'chatbubbles' : 'chatbubbles-outline';
        } else if (route.name === 'Contacts') {
          iconName = focused ? 'people' : 'people-outline';
        } else if (route.name === 'Calls') {
          iconName = focused ? 'call' : 'call-outline';
        } else if (route.name === 'Profile') {
          iconName = focused ? 'person' : 'person-outline';
        } else {
          iconName = 'chatbubble-outline';
        }

        return <Ionicons name={iconName} size={size} color={color} />;
      },
      tabBarActiveTintColor: '#2563EB',
      tabBarInactiveTintColor: 'gray',
      headerShown: false,
    })}
  >
    <Tab.Screen name="Chats" component={ChatListScreen} />
    <Tab.Screen name="Calls" component={CallHistoryScreen} />
    <Tab.Screen name="Contacts" component={ContactsScreen} />
    <Tab.Screen name="Profile" component={ProfileScreen} />
  </Tab.Navigator>
);

// Main App Navigator with proper splash screen handling
export const AppNavigator = () => {
  const [isSplashComplete, setIsSplashComplete] = useState(false);
  const { isAuthenticated, isLoading } = useAuth();

  const handleSplashComplete = () => {
    setIsSplashComplete(true);
  };

  // Show loading screen while checking auth state
  if (isLoading) {
    return <LoadingScreen/>;
  }

  console.log('🔄 AppNavigator - Auth Status:', { 
    isAuthenticated, 
    isSplashComplete,
    isLoading 
  });

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!isSplashComplete ? (
          <Stack.Screen name="Splash">
            {(props) => (
              <SplashScreen 
                {...props} 
                onAnimationComplete={handleSplashComplete} 
              />
            )}
          </Stack.Screen>
        ) : isAuthenticated ? (
          // User is authenticated - show main app
          <>
            <Stack.Screen name="Main" component={MainTabNavigator} />
            
            {/* Call Screens */}
            <Stack.Screen 
              name="IncomingCall" 
              component={IncomingCallScreen}
              options={{ 
                presentation: 'modal',
                gestureEnabled: false 
              }}
            />
            <Stack.Screen 
              name="OutgoingCall" 
              component={OngoingCallScreen}
              options={{ 
                presentation: 'modal',
                gestureEnabled: false 
              }}
            />
            <Stack.Screen 
              name="OngoingCall" 
              component={OngoingCallScreen}
              options={{ 
                presentation: 'modal',
                gestureEnabled: false 
              }}
            />
            
            {/* Chat Screens */}
            <Stack.Screen name="Chat" component={ChatScreen} />
          </>
        ) : (
          // User is not authenticated - show auth flow
          <>
            <Stack.Screen name="Welcome" component={WelcomeScreen} />
            <Stack.Screen name="Auth" component={AuthNavigator} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};