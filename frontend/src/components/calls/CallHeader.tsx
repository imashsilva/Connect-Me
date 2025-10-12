import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Avatar } from '../common/Avatar';
import { User } from '../../types/user';

interface CallHeaderProps {
  user: User;
  callType: 'AUDIO' | 'VIDEO';
  status: 'DIALING' | 'RINGING' | 'ONGOING';
  duration?: number;
}

export const CallHeader: React.FC<CallHeaderProps> = ({ 
  user, 
  callType, 
  status, 
  duration 
}) => {
  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getStatusText = () => {
    switch (status) {
      case 'DIALING':
        return 'Calling...';
      case 'RINGING':
        return 'Ringing...';
      case 'ONGOING':
        return duration ? formatDuration(duration) : 'Connected';
      default:
        return '';
    }
  };

  return (
    <View style={styles.container}>
      <Avatar 
        user={user} 
        size={120} 
        showOnlineStatus={false}
      />
      <Text style={styles.name}>{user.displayName}</Text>
      <Text style={styles.status}>{getStatusText()}</Text>
      <View style={styles.callType}>
        <Ionicons 
          name={callType === 'AUDIO' ? 'call' : 'videocam'} 
          size={16} 
          color="white" 
        />
        <Text style={styles.callTypeText}>
          {callType === 'AUDIO' ? 'Audio Call' : 'Video Call'}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  name: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    marginTop: 20,
    marginBottom: 8,
  },
  status: {
    fontSize: 18,
    color: 'rgba(255,255,255,0.8)',
    marginBottom: 12,
  },
  callType: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  callTypeText: {
    color: 'white',
    fontSize: 14,
    marginLeft: 6,
    fontWeight: '500',
  },
});