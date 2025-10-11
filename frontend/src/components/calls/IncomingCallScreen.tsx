import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Vibration,
  TouchableOpacity,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { RouteProp, useRoute, useNavigation } from '@react-navigation/native';
import { Avatar } from '../common/Avatar';
import { CallButton } from './CallButton';
import { Ionicons } from '@expo/vector-icons';
import { User } from '../../types/user';
import { CallType } from '../../types/call';
import { SafeAreaView } from 'react-native-safe-area-context';

type IncomingCallRouteProps = {
  params: {
    user: User;
    callType: CallType;
  };
};

export const IncomingCallScreen: React.FC = () => {
  const route = useRoute<RouteProp<IncomingCallRouteProps, 'params'>>();
  const navigation = useNavigation();
  const { user, callType } = route.params;
  
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    // Simulate vibration for incoming call
    const vibrationInterval = setInterval(() => {
      Vibration.vibrate([500, 500]);
    }, 1000);

    // Simulate call duration
    const durationInterval = setInterval(() => {
      setDuration(prev => prev + 1);
    }, 1000);

    return () => {
      clearInterval(vibrationInterval);
      clearInterval(durationInterval);
      Vibration.cancel();
    };
  }, []);

  const handleAcceptCall = () => {
    Vibration.cancel();
    navigation.navigate('OngoingCall', {
      user,
      callType,
      isOutgoing: false,
    });
  };

  const handleRejectCall = () => {
    Vibration.cancel();
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#1e3a8a', '#0f172a']}
        style={styles.gradient}
      >
        <View style={styles.content}>
          {/* Caller Info */}
          <View style={styles.header}>
            <Avatar user={user} size={140} showOnlineStatus={false} />
            <Text style={styles.name}>{user.displayName}</Text>
            <Text style={styles.callType}>
              {callType === 'AUDIO' ? 'Audio Call' : 'Video Call'}
            </Text>
            <Text style={styles.status}>Incoming Call...</Text>
          </View>

          {/* Call Controls */}
          <View style={styles.controls}>
            <View style={styles.buttonGroup}>
              <CallButton
                type="audio"
                onPress={handleAcceptCall}
                size="large"
              />
              <Text style={styles.buttonLabel}>Accept</Text>
            </View>

            <View style={styles.buttonGroup}>
              <TouchableOpacity
                style={[styles.rejectButton, styles.button]}
                onPress={handleRejectCall}
              >
                <Ionicons name="call" size={28} color="white" />
              </TouchableOpacity>
              <Text style={styles.buttonLabel}>Decline</Text>
            </View>
          </View>
        </View>
      </LinearGradient>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 80,
  },
  header: {
    alignItems: 'center',
  },
  name: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
    marginTop: 24,
    marginBottom: 8,
  },
  callType: {
    fontSize: 18,
    color: 'rgba(255,255,255,0.8)',
    marginBottom: 8,
  },
  status: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.6)',
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 60,
  },
  buttonGroup: {
    alignItems: 'center',
  },
  button: {
    width: 70,
    height: 70,
    borderRadius: 35,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  rejectButton: {
    backgroundColor: '#EF4444',
  },
  buttonLabel: {
    color: 'white',
    marginTop: 8,
    fontSize: 14,
    fontWeight: '500',
  },
});