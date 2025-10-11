// src/screens/auth/WelcomeScreen.tsx
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ThemeAwareLogo } from '../../components/common/ThemeAwareLogo';
import { useTheme } from '../../hooks/useTheme';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/type';

const { width } = Dimensions.get('window');

type WelcomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Welcome'>;

export const WelcomeScreen: React.FC = () => {
  const { colors, isDark } = useTheme();
  const navigation = useNavigation<WelcomeScreenNavigationProp>();

  const handleGetStarted = () => {
    // Navigate to Register screen through Auth stack
    navigation.navigate('Auth', { screen: 'Register' });
  };

  const handleSignIn = () => {
    // Navigate to Login screen through Auth stack
    navigation.navigate('Auth', { screen: 'Login' });
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <LinearGradient
        colors={isDark ? ['#1e3a8a', '#0f172a'] : ['#0389b5ac', '#2262caff']}
        style={styles.container}
      >
        {/* Logo & App Name */}
        <View style={styles.header}>
          <ThemeAwareLogo size={120} />
          <Text style={styles.appName}>ConnectMe</Text>
          <Text style={styles.tagline}>Stay connected, instantly</Text>
        </View>

        {/* Features List */}
        <View style={styles.featuresContainer}>
          <View style={styles.featureItem}>
            <Ionicons name="chatbubbles" size={32} color="white" />
            <Text style={styles.featureText}>Real-time Messaging</Text>
          </View>
          
          <View style={styles.featureItem}>
            <Ionicons name="people" size={32} color="white" />
            <Text style={styles.featureText}>Group Chats</Text>
          </View>
          
          <View style={styles.featureItem}>
            <Ionicons name="lock-closed" size={32} color="white" />
            <Text style={styles.featureText}>Secure & Private</Text>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.buttonsContainer}>
          <TouchableOpacity 
            style={[styles.primaryButton, { backgroundColor: 'white' }]}
            onPress={handleGetStarted}
          >
            <Text style={[styles.primaryButtonText, { color: colors.primary }]}>
              Get Started
            </Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.secondaryButton, { borderColor: 'white' }]}
            onPress={handleSignIn}
          >
            <Text style={styles.secondaryButtonText}>
              I have an account
            </Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    paddingVertical: 60,
    paddingHorizontal: 24,
  },
  header: {
    alignItems: 'center',
    marginTop: 40,
  },
  appName: {
    fontSize: 42,
    fontWeight: 'bold',
    color: 'white',
    marginTop: 20,
  },
  tagline: {
    fontSize: 18,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 8,
  },
  featuresContainer: {
    alignItems: 'center',
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 12,
    width: width * 0.7,
  },
  featureText: {
    color: 'white',
    fontSize: 18,
    marginLeft: 16,
    fontWeight: '500',
  },
  buttonsContainer: {
    width: '100%',
  },
  primaryButton: {
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  primaryButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  secondaryButton: {
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
    borderWidth: 2,
  },
  secondaryButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
  },
});