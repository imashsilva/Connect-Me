import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../hooks/useTheme';
import { CallHistory } from '../../types';
import { Avatar } from '../../components/common/Avatar';

// Mock data for demonstration
const mockCallHistory: CallHistory[] = [
  {
    id: '1',
    callType: 'AUDIO',
    status: 'ENDED',
    participants: [
      {
        id: 2,
        username: 'jane_doe',
        email: 'jane@example.com',
        displayName: 'Jane Doe',
        profilePicture: '',
        status: 'Available',
        lastSeen: new Date().toISOString(),
        isOnline: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ],
    startTime: new Date(Date.now() - 3600000).toISOString(),
    endTime: new Date(Date.now() - 3540000).toISOString(),
    duration: 600,
    isOutgoing: true,
  },
  // Add more mock calls...
];

export const CallHistoryScreen: React.FC = () => {
  const { colors } = useTheme();

  const formatTime = (date: string) => {
    return new Date(date).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getCallIcon = (callType: string, status: string, isOutgoing: boolean) => {
    if (status === 'MISSED') {
      return isOutgoing ? 'call-missed-outgoing' : 'call-missed';
    }
    return callType === 'AUDIO' ? 'call' : 'videocam';
  };

  const getCallColor = (status: string) => {
    switch (status) {
      case 'MISSED':
        return '#EF4444';
      case 'ENDED':
        return '#10B981';
      default:
        return '#6B7280';
    }
  };

  const renderCallItem = ({ item }: { item: CallHistory }) => (
    <TouchableOpacity style={[styles.callItem, { backgroundColor: colors.card }]}>
      <Avatar user={item.participants[0]} size={50} />
      
      <View style={styles.callInfo}>
        <Text style={[styles.contactName, { color: colors.text }]}>
          {item.participants[0].displayName}
        </Text>
        <View style={styles.callDetails}>
          <Ionicons 
            name={getCallIcon(item.callType, item.status, item.isOutgoing) as any} 
            size={16} 
            color={getCallColor(item.status)} 
          />
          <Text style={[styles.callStatus, { color: colors.subtitle }]}>
            {item.isOutgoing ? 'Outgoing' : 'Incoming'} • 
            {formatTime(item.startTime)} • 
            {item.duration ? formatDuration(item.duration) : 'No answer'}
          </Text>
        </View>
      </View>

      <View style={styles.callActions}>
        <TouchableOpacity style={styles.callButton}>
          <Ionicons 
            name={item.callType === 'AUDIO' ? 'call' : 'videocam'} 
            size={24} 
            color={colors.primary} 
          />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>Call History</Text>
      </View>

      <FlatList
        data={mockCallHistory}
        renderItem={renderCallItem}
        keyExtractor={item => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.1)',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  listContent: {
    padding: 16,
  },
  callItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  callInfo: {
    flex: 1,
    marginLeft: 12,
  },
  contactName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  callDetails: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  callStatus: {
    fontSize: 14,
    marginLeft: 6,
  },
  callActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  callButton: {
    padding: 8,
  },
});