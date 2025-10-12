import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface CallControlsProps {
  onEndCall: () => void;
  onToggleMute?: () => void;
  onToggleSpeaker?: () => void;
  onToggleVideo?: () => void;
  isMuted?: boolean;
  isSpeakerOn?: boolean;
  isVideoOn?: boolean;
  callType: 'AUDIO' | 'VIDEO';
}

export const CallControls: React.FC<CallControlsProps> = ({
  onEndCall,
  onToggleMute,
  onToggleSpeaker,
  onToggleVideo,
  isMuted = false,
  isSpeakerOn = false,
  isVideoOn = true,
  callType,
}) => {
  return (
    <View style={styles.container}>
      {/* Mute Button */}
      {onToggleMute && (
        <TouchableOpacity
          style={[
            styles.controlButton,
            isMuted && styles.controlButtonActive,
          ]}
          onPress={onToggleMute}
        >
          <Ionicons
            name={isMuted ? 'mic-off' : 'mic'}
            size={24}
            color="white"
          />
        </TouchableOpacity>
      )}

      {/* Speaker Button */}
      {onToggleSpeaker && (
        <TouchableOpacity
          style={[
            styles.controlButton,
            isSpeakerOn && styles.controlButtonActive,
          ]}
          onPress={onToggleSpeaker}
        >
          <Ionicons
            name={isSpeakerOn ? 'volume-high' : 'volume-low'}
            size={24}
            color="white"
          />
        </TouchableOpacity>
      )}

      {/* Video Toggle Button (only for video calls) */}
      {callType === 'VIDEO' && onToggleVideo && (
        <TouchableOpacity
          style={[
            styles.controlButton,
            !isVideoOn && styles.controlButtonActive,
          ]}
          onPress={onToggleVideo}
        >
          <Ionicons
            name={isVideoOn ? 'videocam' : 'videocam-off'}
            size={24}
            color="white"
          />
        </TouchableOpacity>
      )}

      {/* End Call Button */}
      <TouchableOpacity
        style={[styles.controlButton, styles.endCallButton]}
        onPress={onEndCall}
      >
        <Ionicons name="call" size={24} color="white" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 30,
    gap: 20,
  },
  controlButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  controlButtonActive: {
    backgroundColor: 'rgba(255,255,255,0.4)',
  },
  endCallButton: {
    backgroundColor: '#EF4444',
  },
});