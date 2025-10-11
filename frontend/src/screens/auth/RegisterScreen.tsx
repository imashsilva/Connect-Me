// src/screens/auth/RegisterScreen.tsx
import React, { useState } from 'react';
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
  Image,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as ImagePicker from 'expo-image-picker';
import { useTheme } from '../../hooks/useTheme';
import { Ionicons } from '@react-native-vector-icons/ionicons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CustomButton } from '../../components/common/CustomButton';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';

export const RegisterScreen: React.FC = ({ navigation }: any) => {
  const { colors, isDark, getGradientColors } = useTheme();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const pickProfileImage = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (status !== 'granted') {
        Alert.alert('Permission Required', 'Sorry, we need camera roll permissions to upload profile pictures.');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        setProfileImage(result.assets[0].uri);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to pick image. Please try again.');
    }
  };

  const testRegistration = async () => {
  try {
    console.log('👤 Testing registration endpoint...');
    
    const testUser = {
      username: 'testuser123',
      email: 'test123@example.com',
      password: 'password123',
      displayName: 'Test User',
      phoneNumber: '+1234567890'
    };
    
    const endpoints = [
      '/auth/register',
      '/register', 
      '/users/register',
      '/user/register',
      '/signup'
    ];
    
    for (const endpoint of endpoints) {
      try {
        const response = await fetch(
          `https://corrie-variolitic-impolitely.ngrok-free.dev/Connect_Me/api${endpoint}`,
          {
            method: 'POST',
            headers: { 
              'Content-Type': 'application/json',
              'Accept': 'application/json'
            },
            body: JSON.stringify(testUser)
          }
        );
        
        console.log(`Registration endpoint ${endpoint}: Status ${response.status}`);
        
        if (response.status !== 404) {
          const text = await response.text();
          console.log(`Registration response for ${endpoint}:`, text);
        }
        
      } catch (error) {
        console.log(`Registration endpoint ${endpoint}: Error -`, error);
      }
    }
    
  } catch (error) {
    console.error('Registration test error:', error);
  }
};

  const takeProfilePhoto = async () => {
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      
      if (status !== 'granted') {
        Alert.alert('Permission Required', 'Sorry, we need camera permissions to take photos.');
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        setProfileImage(result.assets[0].uri);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to take photo. Please try again.');
    }
  };

  const validateForm = (): boolean => {
    if (!formData.fullName.trim()) {
      Alert.alert('Error', 'Please enter your full name');
      return false;
    }

    if (!formData.email.trim() || !/\S+@\S+\.\S+/.test(formData.email)) {
      Alert.alert('Error', 'Please enter a valid email address');
      return false;
    }

    if (!formData.phone.trim()) {
      Alert.alert('Error', 'Please enter your phone number');
      return false;
    }

    if (formData.password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters long');
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return false;
    }

    if (!acceptTerms) {
      Alert.alert('Error', 'Please accept the Terms & Conditions');
      return false;
    }

    return true;
  };

  const handleRegister = async () => {
    if (!validateForm()) return;

    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      Alert.alert(
        'Verification Email Sent',
        'Please check your email to verify your account before signing in.',
        [
          {
            text: 'OK',
            onPress: () => navigation.navigate('Login'),
          },
        ]
      );
    }, 2000);
  };

  const gradientColors = getGradientColors();

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <LinearGradient colors={gradientColors} style={styles.container}>
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
              onPress={() => navigation.goBack()}
            >
              <Ionicons name="arrow-back" size={24} color="white" />
            </TouchableOpacity>
            <Text style={styles.title}>Create Account</Text>
            <Text style={styles.subtitle}>Join ConnectMe today</Text>
          </View>

          {/* Registration Form */}
          <View style={[styles.formContainer, { backgroundColor: colors.card }]}>

            {/* Profile Picture Section */}
            <View style={styles.profileSection}>
              <View style={styles.avatarContainer}>
                {profileImage ? (
                  <Image source={{ uri: profileImage }} style={styles.avatar} />
                ) : (
                  <View style={[styles.avatarPlaceholder, { backgroundColor: colors.primary }]}>
                    <Ionicons name="person" size={40} color="white" />
                  </View>
                )}
                
                {/* Camera Button */}
                <TouchableOpacity 
                  style={[styles.cameraButton, { backgroundColor: colors.primary }]}
                  onPress={pickProfileImage}
                >
                  <Ionicons name="camera" size={20} color="white" />
                </TouchableOpacity>
              </View>

              <Text style={[styles.avatarText, { color: colors.text }]}>
                Profile Picture
              </Text>
              
              <View style={styles.photoOptions}>
                <TouchableOpacity 
                  style={[styles.photoOption, { backgroundColor: isDark ? '#374151' : '#F3F4F6' }]}
                  onPress={pickProfileImage}
                >
                  <Ionicons name="image" size={20} color={colors.primary} />
                  <Text style={[styles.photoOptionText, { color: colors.text }]}>
                    Gallery
                  </Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={[styles.photoOption, { backgroundColor: isDark ? '#374151' : '#F3F4F6' }]}
                  onPress={takeProfilePhoto}
                >
                  <Ionicons name="camera" size={20} color={colors.primary} />
                  <Text style={[styles.photoOptionText, { color: colors.text }]}>
                    Camera
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Full Name Input */}
            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: colors.text }]}>Full Name</Text>
              <View style={[styles.inputWrapper, { backgroundColor: isDark ? '#374151' : '#F9FAFB', borderColor: colors.border }]}>
                <Ionicons name="person-outline" size={20} color={colors.subtitle} style={styles.inputIcon} />
                <TextInput
                  style={[styles.input, { color: colors.text }]}
                  placeholder="Enter your full name"
                  placeholderTextColor={colors.subtitle}
                  value={formData.fullName}
                  onChangeText={(value) => handleInputChange('fullName', value)}
                  autoCapitalize="words"
                />
              </View>
            </View>

            {/* Email Input */}
            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: colors.text }]}>Email Address</Text>
              <View style={[styles.inputWrapper, { backgroundColor: isDark ? '#374151' : '#F9FAFB', borderColor: colors.border }]}>
                <Ionicons name="mail-outline" size={20} color={colors.subtitle} style={styles.inputIcon} />
                <TextInput
                  style={[styles.input, { color: colors.text }]}
                  placeholder="Enter your email"
                  placeholderTextColor={colors.subtitle}
                  value={formData.email}
                  onChangeText={(value) => handleInputChange('email', value)}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoComplete="email"
                />
              </View>
            </View>

            {/* Phone Input */}
            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: colors.text }]}>Phone Number</Text>
              <View style={[styles.inputWrapper, { backgroundColor: isDark ? '#374151' : '#F9FAFB', borderColor: colors.border }]}>
                <Ionicons name="call-outline" size={20} color={colors.subtitle} style={styles.inputIcon} />
                <TextInput
                  style={[styles.input, { color: colors.text }]}
                  placeholder="Enter your phone number"
                  placeholderTextColor={colors.subtitle}
                  value={formData.phone}
                  onChangeText={(value) => handleInputChange('phone', value)}
                  keyboardType="phone-pad"
                  autoComplete="tel"
                />
              </View>
            </View>

            {/* Password Input */}
            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: colors.text }]}>Password</Text>
              <View style={[styles.inputWrapper, { backgroundColor: isDark ? '#374151' : '#F9FAFB', borderColor: colors.border }]}>
                <Ionicons name="lock-closed-outline" size={20} color={colors.subtitle} style={styles.inputIcon} />
                <TextInput
                  style={[styles.input, { color: colors.text }]}
                  placeholder="Create a password"
                  placeholderTextColor={colors.subtitle}
                  value={formData.password}
                  onChangeText={(value) => handleInputChange('password', value)}
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                />
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                  <Ionicons 
                    name={showPassword ? "eye-off-outline" : "eye-outline"} 
                    size={20} 
                    color={colors.subtitle} 
                  />
                </TouchableOpacity>
              </View>
            </View>

            {/* Confirm Password Input */}
            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: colors.text }]}>Confirm Password</Text>
              <View style={[styles.inputWrapper, { backgroundColor: isDark ? '#374151' : '#F9FAFB', borderColor: colors.border }]}>
                <Ionicons name="lock-closed-outline" size={20} color={colors.subtitle} style={styles.inputIcon} />
                <TextInput
                  style={[styles.input, { color: colors.text }]}
                  placeholder="Confirm your password"
                  placeholderTextColor={colors.subtitle}
                  value={formData.confirmPassword}
                  onChangeText={(value) => handleInputChange('confirmPassword', value)}
                  secureTextEntry={!showConfirmPassword}
                  autoCapitalize="none"
                />
                <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
                  <Ionicons 
                    name={showConfirmPassword ? "eye-off-outline" : "eye-outline"} 
                    size={20} 
                    color={colors.subtitle} 
                  />
                </TouchableOpacity>
              </View>
            </View>

            {/* Terms & Conditions */}
            <View style={styles.termsContainer}>
              <TouchableOpacity 
                style={styles.checkboxContainer}
                onPress={() => setAcceptTerms(!acceptTerms)}
              >
                <View style={[
                  styles.checkbox,
                  { 
                    backgroundColor: acceptTerms ? colors.primary : 'transparent',
                    borderColor: acceptTerms ? colors.primary : colors.border,
                  }
                ]}>
                  {acceptTerms && (
                    <Ionicons name="checkmark" size={16} color="white" />
                  )}
                </View>
                <Text style={[styles.termsText, { color: colors.text }]}>
                  I agree to the 
                </Text>
                <TouchableOpacity onPress={() => Alert.alert('Terms & Conditions', 'This is where your terms and conditions would be displayed.')}>
                  <Text style={[styles.termsLink, { color: colors.primary }]}> Terms & Conditions</Text>
                </TouchableOpacity>
              </TouchableOpacity>
            </View>

            {/* Register Button */}
            <CustomButton
              title="Create Account"
              onPress={handleRegister}
              loading={isLoading}
              style={styles.registerButton}
            />

            {/* Sign In Link */}
            <View style={styles.signInContainer}>
              <Text style={[styles.signInText, { color: colors.subtitle }]}>
                Already have an account? 
              </Text>
              <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                <Text style={[styles.signInLink, { color: colors.primary }]}> Sign In</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Loading Overlay */}
      {isLoading && <LoadingSpinner />}
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
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
    marginTop: 20,
  },
  backButton: {
    position: 'absolute',
    left: 0,
    top: 0,
    padding: 8,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.8)',
    textAlign: 'center',
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
  profileSection: {
    alignItems: 'center',
    marginBottom: 30,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 12,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  avatarPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cameraButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: 'white',
  },
  avatarText: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  photoOptions: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
  },
  photoOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
    gap: 6,
  },
  photoOptionText: {
    fontSize: 14,
    fontWeight: '500',
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
  },
  termsContainer: {
    marginBottom: 24,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 6,
    borderWidth: 2,
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  termsText: {
    fontSize: 14,
  },
  termsLink: {
    fontSize: 14,
    fontWeight: '600',
  },
  registerButton: {
    marginBottom: 24,
  },
  signInContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  signInText: {
    fontSize: 16,
  },
  signInLink: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});