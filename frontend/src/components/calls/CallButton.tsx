import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface CallButtonProps {
  type: 'audio' | 'video';
  onPress: () => void;
  size?: 'small' | 'large';
  disabled?: boolean;
}

export const CallButton: React.FC<CallButtonProps> = ({ 
  type, 
  onPress, 
  size = 'large',
  disabled = false 
}) => {
  const iconName = type === 'audio' ? 'call' : 'videocam';
  const buttonSize = size === 'large' ? 60 : 44;
  const iconSize = size === 'large' ? 28 : 22;

  return (
    <TouchableOpacity
      style={[
        styles.button,
        {
          width: buttonSize,
          height: buttonSize,
          borderRadius: buttonSize / 2,
          backgroundColor: type === 'audio' ? '#069f3cff' : '#3B82F6',
          opacity: disabled ? 0.6 : 1,
        },
      ]}
      onPress={onPress}
      disabled={disabled}
    >
      <Ionicons name={iconName} size={iconSize} color="white" />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
});