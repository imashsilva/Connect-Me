import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../../hooks/useTheme';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { CustomButton } from '../../components/common/CustomButton';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../../navigation/type';
import { useAuth } from '../../contexts/AuthContext';

type LoginScreenNavigationProp = NativeStackNavigationProp<AuthStackParamList, 'Login'>;

export const LoginScreen: React.FC = () => {
  const { colors, isDark } = useTheme();
  const { login, isLoading } = useAuth();
  const navigation = useNavigation<LoginScreenNavigationProp>();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      Alert.alert('Error', 'Please enter a valid email address');
      return;
    }

    try {
      const result = await login({ email, password });

      if (result.success) {
        // Navigation happens automatically due to auth state change
        console.log('✅ Login successful');
      } else {
        Alert.alert('Login Failed', result.error || 'Something went wrong');
      }
    } catch (error: any) {
      Alert.alert('Login Failed', error.message || 'An unexpected error occurred');
    }
  };

  const handleSocialLogin = (provider: string) => {
    Alert.alert('Coming Soon', `${provider} login will be available soon!`);
  };

  const handleForgotPassword = () => {
    Alert.alert('Feature Coming Soon', 'Password reset functionality will be added in the next update.');
  };

  const navigateToRegister = () => {
    navigation.navigate('Register');
  };

  const navigateBack = () => {
    navigation.goBack();
  };

  const testDirectLogin = async () => {
    try {
      console.log('🧪 Testing direct fetch login...');

      const response = await fetch('https://corrie-variolitic-impolitely.ngrok-free.dev/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          email: 'test@example.com',
          password: 'password123'
        })
      });

      console.log('Direct fetch response status:', response.status);
      console.log('Direct fetch response headers:', response.headers);

      const text = await response.text();
      console.log('Direct fetch response text:', text);

      try {
        const data = JSON.parse(text);
        console.log('Direct fetch response JSON:', data);
      } catch (e) {
        console.log('Response is not JSON:', text);
      }

    } catch (error) {
      console.error('Direct fetch error:', error);
    }
  };

  const testAuthEndpoints = async () => {
  try {
    console.log('🎯 Testing exact auth endpoints...');
    
    const baseUrl = 'https://corrie-variolitic-impolitely.ngrok-free.dev/Connect_Me/api';
    
    // Test different auth endpoint variations
    const endpoints = [
      '/auth/login',
      '/login',
      '/users/login',
      '/user/login',
      '/authenticate'
    ];
    
    for (const endpoint of endpoints) {
      try {
        const testUrl = `${baseUrl}${endpoint}`;
        console.log(`Testing: ${testUrl}`);
        
        const response = await fetch(testUrl, {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify({ 
            email: 'test@test.com', 
            password: 'password123' 
          })
        });
        
        console.log(`Endpoint ${endpoint}: Status ${response.status}`);
        
        if (response.status !== 404 && response.status !== 401) {
          const text = await response.text();
          console.log(`Response for ${endpoint}:`, text);
        }
        
      } catch (error) {
        console.log(`Endpoint ${endpoint}: Error -`, error);
      }
    }
    
  } catch (error) {
    console.error('Auth endpoint test error:', error);
  }
};

// Call this in useEffect
useEffect(() => {
  testAuthEndpoints();
}, []);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <LinearGradient
        colors={isDark ? ['#1e3a8a', '#0f172a'] : ['#2563EB', '#3B82F6']}
        style={styles.container}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardView}
        >
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            {/* Header */}
            <View style={styles.header}>
              <TouchableOpacity
                style={styles.backButton}
                onPress={navigateBack}
              >
                <Ionicons name="arrow-back" size={24} color="white" />
              </TouchableOpacity>
              <Text style={styles.title}>Welcome Back</Text>
              <Text style={styles.subtitle}>Sign in to continue your conversations</Text>
            </View>

            {/* Login Form */}
            <View style={[styles.formContainer, { backgroundColor: colors.card }]}>
              {/* Email Input */}
              <View style={styles.inputGroup}>
                <Text style={[styles.label, { color: colors.text }]}>Email Address</Text>
                <View style={[styles.inputWrapper, { backgroundColor: colors.background, borderColor: colors.border }]}>
                  <Ionicons name="mail-outline" size={20} color={colors.subtitle} style={styles.inputIcon} />
                  <TextInput
                    style={[styles.input, { color: colors.text }]}
                    placeholder="Enter your email"
                    placeholderTextColor={colors.subtitle}
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoComplete="email"
                    autoCorrect={false}
                    editable={!isLoading}
                  />
                </View>
              </View>

              {/* Password Input */}
              <View style={styles.inputGroup}>
                <Text style={[styles.label, { color: colors.text }]}>Password</Text>
                <View style={[styles.inputWrapper, { backgroundColor: colors.background, borderColor: colors.border }]}>
                  <Ionicons name="lock-closed-outline" size={20} color={colors.subtitle} style={styles.inputIcon} />
                  <TextInput
                    style={[styles.input, { color: colors.text }]}
                    placeholder="Enter your password"
                    placeholderTextColor={colors.subtitle}
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry={!showPassword}
                    autoCapitalize="none"
                    autoCorrect={false}
                    editable={!isLoading}
                    onSubmitEditing={handleLogin}
                  />
                  <TouchableOpacity
                    onPress={() => setShowPassword(!showPassword)}
                    disabled={isLoading}
                  >
                    <Ionicons
                      name={showPassword ? "eye-off-outline" : "eye-outline"}
                      size={20}
                      color={colors.subtitle}
                    />
                  </TouchableOpacity>
                </View>

                {/* Forgot Password */}
                <TouchableOpacity
                  style={styles.forgotPassword}
                  onPress={handleForgotPassword}
                  disabled={isLoading}
                >
                  <Text style={[styles.forgotPasswordText, { color: colors.primary }]}>
                    Forgot Password?
                  </Text>
                </TouchableOpacity>
              </View>

              {/* Login Button */}
              <CustomButton
                title="Sign In"
                onPress={handleLogin}
                loading={isLoading}
                style={styles.loginButton}
                disabled={isLoading}
              />

              {/* Divider */}
              <View style={styles.dividerContainer}>
                <View style={[styles.divider, { backgroundColor: colors.border }]} />
                <Text style={[styles.dividerText, { color: colors.subtitle }]}>or continue with</Text>
                <View style={[styles.divider, { backgroundColor: colors.border }]} />
              </View>

              {/* Social Login Buttons */}
              <View style={styles.socialButtonsContainer}>
                <TouchableOpacity
                  style={[styles.socialButton, { backgroundColor: colors.background }]}
                  onPress={() => handleSocialLogin('Google')}
                  disabled={isLoading}
                >
                  <Ionicons name="logo-google" size={24} color="#DB4437" />
                  <Text style={[styles.socialButtonText, { color: colors.text }]}>Google</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.socialButton, { backgroundColor: colors.background }]}
                  onPress={() => handleSocialLogin('Apple')}
                  disabled={isLoading}
                >
                  <Ionicons name="logo-apple" size={24} color={colors.text} />
                  <Text style={[styles.socialButtonText, { color: colors.text }]}>Apple</Text>
                </TouchableOpacity>
              </View>

              {/* Sign Up Link */}
              <View style={styles.signUpContainer}>
                <Text style={[styles.signUpText, { color: colors.subtitle }]}>
                  Don't have an account?
                </Text>
                <TouchableOpacity
                  onPress={navigateToRegister}
                  disabled={isLoading}
                >
                  <Text style={[styles.signUpLink, { color: colors.primary }]}> Sign Up</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Demo Credentials Hint */}
            <View style={styles.demoContainer}>
              <Text style={[styles.demoText, { color: 'rgba(255,255,255,0.7)' }]}>
                💡 Demo: Use any email/password combination
              </Text>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </LinearGradient>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
    paddingTop: 20,
  },
  backButton: {
    position: 'absolute',
    left: 0,
    top: 0,
    padding: 8,
    zIndex: 1,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.8)',
    textAlign: 'center',
    lineHeight: 22,
  },
  formContainer: {
    borderRadius: 24,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 56,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    height: '100%',
    paddingVertical: 0,
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginTop: 8,
  },
  forgotPasswordText: {
    fontSize: 14,
    fontWeight: '600',
  },
  loginButton: {
    marginTop: 8,
    marginBottom: 24,
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  divider: {
    flex: 1,
    height: 1,
  },
  dividerText: {
    fontSize: 14,
    fontWeight: '500',
    marginHorizontal: 16,
  },
  socialButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  socialButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    paddingVertical: 14,
    marginHorizontal: 6,
  },
  socialButtonText: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  signUpContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  signUpText: {
    fontSize: 16,
  },
  signUpLink: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  demoContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  demoText: {
    fontSize: 14,
    textAlign: 'center',
    fontStyle: 'italic',
  },
});