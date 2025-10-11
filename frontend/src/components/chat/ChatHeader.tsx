import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { Avatar } from '../common/Avatar';
import { CallButton } from '../calls/CallButton';
import { RootStackParamList } from '../../navigation/type';
import { User } from '../../types/user';
import { CallType } from '../../types/call';

interface ChatHeaderProps {
  user: User;
  isOnline: boolean;
}

export const ChatHeader: React.FC<ChatHeaderProps> = ({ user, isOnline }) => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  const handleAudioCall = () => {
    navigation.navigate('OutgoingCall', { 
      user, 
      callType: 'AUDIO' as CallType
    });
  };

  const handleVideoCall = () => {
    navigation.navigate('OutgoingCall', { 
      user, 
      callType: 'VIDEO' as CallType
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.userInfo}>
        <Avatar user={user} size={40} />
        <View style={styles.textContainer}>
          <Text style={styles.name}>{user.displayName}</Text>
          <Text style={styles.status}>
            {isOnline ? 'Online' : 'Last seen recently'}
          </Text>
        </View>
      </View>

      <View style={styles.actions}>
        <CallButton type="audio" onPress={handleAudioCall} size="small" />
        <CallButton type="video" onPress={handleVideoCall} size="small" />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  textContainer: {
    marginLeft: 12,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  status: {
    fontSize: 14,
    color: '#6B7280',
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
});