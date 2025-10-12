import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { RouteProp, useRoute, useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { User } from '../../types/user';
import { CallType } from '../../types/call';
import { CallHeader } from './CallHeader';
import { CallControls } from './CallControls';
import { SafeAreaView } from 'react-native-safe-area-context';

type OngoingCallRouteProps = {
  params: {
    user: User;
    callType: CallType;
    isOutgoing: boolean;
  };
};

export const OngoingCallScreen: React.FC = () => {
  const route = useRoute<RouteProp<OngoingCallRouteProps, 'params'>>();
  const navigation = useNavigation();
  const { user, callType, isOutgoing } = route.params;
  
  const [duration, setDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isSpeakerOn, setIsSpeakerOn] = useState(false);
  const [isVideoOn, setIsVideoOn] = useState(callType === 'VIDEO');

  useEffect(() => {
    const interval = setInterval(() => {
      setDuration(prev => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleEndCall = () => {
    navigation.goBack();
  };

  const handleToggleMute = () => {
    setIsMuted(prev => !prev);
  };

  const handleToggleSpeaker = () => {
    setIsSpeakerOn(prev => !prev);
  };

  const handleToggleVideo = () => {
    setIsVideoOn(prev => !prev);
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#1e3a8a', '#0f172a']}
        style={styles.gradient}
      >
        {/* Video Preview (for video calls) */}
        {callType === 'VIDEO' && isVideoOn && (
          <View style={styles.videoContainer}>
            {/* This would be the actual video stream in a real app */}
            <View style={styles.videoPlaceholder}>
              <Text style={styles.videoPlaceholderText}>
                Video Stream
              </Text>
            </View>
            
            {/* Local video preview */}
            <View style={styles.localVideo}>
              <Text style={styles.localVideoText}>You</Text>
            </View>
          </View>
        )}

        {/* Call Info (for audio calls or when video is off) */}
        {(callType === 'AUDIO' || !isVideoOn) && (
          <CallHeader
            user={user}
            callType={callType}
            status="ONGOING"
            duration={duration}
          />
        )}

        {/* Call Controls */}
        <CallControls
          onEndCall={handleEndCall}
          onToggleMute={handleToggleMute}
          onToggleSpeaker={handleToggleSpeaker}
          onToggleVideo={callType === 'VIDEO' ? handleToggleVideo : undefined}
          isMuted={isMuted}
          isSpeakerOn={isSpeakerOn}
          isVideoOn={isVideoOn}
          callType={callType}
        />

        {/* Additional Info */}
        <View style={styles.infoContainer}>
          <Text style={styles.infoText}>
            {isOutgoing ? 'Outgoing Call' : 'Incoming Call'}
          </Text>
          <View style={styles.statusIcons}>
            {isMuted && (
              <Ionicons name="mic-off" size={16} color="#EF4444" />
            )}
            {!isVideoOn && callType === 'VIDEO' && (
              <Ionicons name="videocam-off" size={16} color="#EF4444" />
            )}
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
  videoContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  videoPlaceholder: {
    width: '90%',
    height: '60%',
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 16,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  videoPlaceholderText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '500',
  },
  localVideo: {
    position: 'absolute',
    top: 50,
    right: 20,
    width: 120,
    height: 160,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  localVideoText: {
    color: 'white',
    fontSize: 14,
  },
  infoContainer: {
    position: 'absolute',
    top: 50,
    left: 20,
    alignItems: 'flex-start',
  },
  infoText: {
    color: 'white',
    fontSize: 14,
    marginBottom: 8,
  },
  statusIcons: {
    flexDirection: 'row',
    gap: 8,
  },
});