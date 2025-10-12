// src/screens/settings/EditProfileScreen.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../hooks/useTheme';
import { Ionicons } from '@react-native-vector-icons/ionicons';
import * as ImagePicker from 'expo-image-picker';

export const ProfileScreen: React.FC = ({ navigation, route }: any) => {
  const { colors, isDark } = useTheme();
  const { user: initialUser } = route.params || {};
  
  const [user, setUser] = useState({
    displayName: initialUser?.displayName || '',
    username: initialUser?.username || '',
    email: initialUser?.email || '',
    phone: initialUser?.phone || '',
    status: initialUser?.status || '',
    profilePicture: initialUser?.profilePicture || null as string | null,
  });
  
  const [isLoading, setIsLoading] = useState(false);

  const handleChangeProfilePicture = async () => {
    try {
      Alert.alert(
        'Change Profile Picture',
        'Choose an option',
        [
          {
            text: 'Take Photo',
            onPress: takePhoto,
          },
          {
            text: 'Choose from Gallery',
            onPress: pickImage,
          },
          {
            text: 'Cancel',
            style: 'cancel',
          },
        ]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to change profile picture.');
    }
  };

  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    
    if (status !== 'granted') {
      Alert.alert('Permission Required', 'Camera permission is required to take photos.');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      setUser(prev => ({ ...prev, profilePicture: result.assets[0].uri }));
    }
  };

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (status !== 'granted') {
      Alert.alert('Permission Required', 'Gallery permission is required to choose photos.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      setUser(prev => ({ ...prev, profilePicture: result.assets[0].uri }));
    }
  };

  const handleSave = async () => {
    if (!user.displayName.trim()) {
      Alert.alert('Error', 'Please enter your display name.');
      return;
    }

    if (!user.username.trim()) {
      Alert.alert('Error', 'Please enter your username.');
      return;
    }

    if (!user.email.trim() || !/\S+@\S+\.\S+/.test(user.email)) {
      Alert.alert('Error', 'Please enter a valid email address.');
      return;
    }

    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      Alert.alert('Success', 'Profile updated successfully!');
      navigation.goBack();
    }, 1500);
  };

  const InputField = ({ label, value, onChange, placeholder, keyboardType = 'default', autoCapitalize = 'sentences' }: any) => (
    <View style={styles.inputGroup}>
      <Text style={[styles.label, { color: colors.text }]}>{label}</Text>
      <View style={[styles.inputContainer, { backgroundColor: isDark ? '#374151' : '#F9FAFB', borderColor: colors.border }]}>
        <TextInput
          style={[styles.input, { color: colors.text }]}
          value={value}
          onChangeText={onChange}
          placeholder={placeholder}
          placeholderTextColor={colors.subtitle}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
        />
      </View>
    </View>
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        {/* Header */}
        <View style={[styles.header, { backgroundColor: colors.card, borderBottomColor: colors.border }]}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color={colors.primary} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: colors.text }]}>
            Edit Profile
          </Text>
          <TouchableOpacity 
            style={[styles.saveButton, { backgroundColor: colors.primary }]}
            onPress={handleSave}
            disabled={isLoading}
          >
            <Text style={styles.saveButtonText}>
              {isLoading ? 'Saving...' : 'Save'}
            </Text>
          </TouchableOpacity>
        </View>

        <ScrollView 
          style={styles.container}
          showsVerticalScrollIndicator={false}
        >
          {/* Profile Picture Section */}
          <View style={[styles.profileSection, { backgroundColor: colors.card }]}>
            <TouchableOpacity 
              style={styles.avatarContainer}
              onPress={handleChangeProfilePicture}
            >
              {user.profilePicture ? (
                <View style={styles.avatar}>
                  {/* In real app, you would display the actual image */}
                  <View style={[styles.avatar, { backgroundColor: colors.primary }]}>
                    <Text style={styles.avatarText}>
                      {user.displayName?.charAt(0).toUpperCase() || 'U'}
                    </Text>
                  </View>
                </View>
              ) : (
                <View style={[styles.avatar, { backgroundColor: colors.primary }]}>
                  <Text style={styles.avatarText}>
                    {user.displayName?.charAt(0).toUpperCase() || 'U'}
                  </Text>
                </View>
              )}
              
              <View style={[styles.cameraButton, { backgroundColor: colors.primary }]}>
                <Ionicons name="camera" size={16} color="white" />
              </View>
            </TouchableOpacity>

            <Text style={[styles.avatarText, { color: colors.text, marginTop: 12 }]}>
              Tap to change photo
            </Text>
          </View>

          {/* Form Section */}
          <View style={[styles.formSection, { backgroundColor: colors.card }]}>
            <InputField
              label="Display Name"
              value={user.displayName}
              onChange={(text: string) => setUser(prev => ({ ...prev, displayName: text }))}
              placeholder="Enter your display name"
              autoCapitalize="words"
            />

            <InputField
              label="Username"
              value={user.username}
              onChange={(text: string) => setUser(prev => ({ ...prev, username: text }))}
              placeholder="Enter your username"
              autoCapitalize="none"
            />

            <InputField
              label="Email"
              value={user.email}
              onChange={(text: string) => setUser(prev => ({ ...prev, email: text }))}
              placeholder="Enter your email address"
              keyboardType="email-address"
              autoCapitalize="none"
            />

            <InputField
              label="Phone Number"
              value={user.phone}
              onChange={(text: string) => setUser(prev => ({ ...prev, phone: text }))}
              placeholder="Enter your phone number"
              keyboardType="phone-pad"
            />

            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: colors.text }]}>Status</Text>
              <View style={[styles.inputContainer, { backgroundColor: isDark ? '#374151' : '#F9FAFB', borderColor: colors.border }]}>
                <TextInput
                  style={[styles.input, { color: colors.text, height: 80 }]}
                  value={user.status}
                  onChangeText={(text) => setUser(prev => ({ ...prev, status: text }))}
                  placeholder="What's on your mind?"
                  placeholderTextColor={colors.subtitle}
                  multiline
                  textAlignVertical="top"
                  maxLength={100}
                />
              </View>
              <Text style={[styles.charCount, { color: colors.subtitle }]}>
                {user.status.length}/100
              </Text>
            </View>
          </View>

          {/* Danger Zone */}
          <View style={[styles.dangerZone, { backgroundColor: colors.card }]}>
            <Text style={[styles.dangerZoneTitle, { color: '#DC2626' }]}>
              Danger Zone
            </Text>
            
            <TouchableOpacity 
              style={[styles.dangerButton, { borderColor: '#DC2626' }]}
              onPress={() => {
                Alert.alert(
                  'Delete Account',
                  'Are you sure you want to delete your account? This action cannot be undone.',
                  [
                    { text: 'Cancel', style: 'cancel' },
                    { text: 'Delete', style: 'destructive', onPress: () => {} }
                  ]
                );
              }}
            >
              <Ionicons name="trash-outline" size={20} color="#DC2626" />
              <Text style={[styles.dangerButtonText, { color: '#DC2626' }]}>
                Delete Account
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  saveButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  saveButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  profileSection: {
    alignItems: 'center',
    padding: 24,
    margin: 16,
    borderRadius: 16,
  },
  avatarContainer: {
    position: 'relative',
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: 'white',
    fontSize: 36,
    fontWeight: 'bold',
  },
  cameraButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: 'white',
  },
  formSection: {
    margin: 16,
    padding: 20,
    borderRadius: 16,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  inputContainer: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
  },
  input: {
    fontSize: 16,
    paddingVertical: 12,
    minHeight: 48,
  },
  charCount: {
    fontSize: 12,
    textAlign: 'right',
    marginTop: 4,
  },
  dangerZone: {
    margin: 16,
    padding: 20,
    borderRadius: 16,
  },
  dangerZoneTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  dangerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    gap: 8,
  },
  dangerButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
});