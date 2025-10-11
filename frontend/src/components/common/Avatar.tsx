import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { User } from '../../types/user';
import { useTheme } from '../../hooks/useTheme';

interface AvatarProps {
  user: User;
  size?: number;
  showOnlineStatus?: boolean;
}

export const Avatar: React.FC<AvatarProps> = ({ 
  user, 
  size = 50, 
  showOnlineStatus = true 
}) => {
  const { colors } = useTheme();

  const getInitials = (name: string): string => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const containerStyle = {
    width: size,
    height: size,
    borderRadius: size / 2,
    backgroundColor: user.profilePicture ? 'transparent' : colors.primary,
  };

  const textStyle = {
    fontSize: size * 0.4,
    color: 'white',
    fontWeight: 'bold' as const,
  };

  const onlineIndicatorStyle = {
    width: size * 0.25,
    height: size * 0.25,
    borderRadius: (size * 0.25) / 2,
    borderWidth: 2,
    borderColor: colors.background,
    backgroundColor: user.isOnline ? '#10B981' : '#6B7280',
  };

  return (
    <View style={styles.container}>
      <View style={[styles.avatarContainer, containerStyle]}>
        {user.profilePicture ? (
          <Image
            source={{ uri: user.profilePicture }}
            style={[styles.avatarImage, { width: size, height: size, borderRadius: size / 2 }]}
          />
        ) : (
          <Text style={[styles.avatarText, textStyle]}>
            {getInitials(user.displayName)}
          </Text>
        )}
      </View>
      
      {showOnlineStatus && (
        <View style={[styles.onlineIndicator, onlineIndicatorStyle]} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
  },
  avatarContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  avatarImage: {
    resizeMode: 'cover',
  },
  avatarText: {
    fontWeight: 'bold',
  },
  onlineIndicator: {
    position: 'absolute',
    bottom: 0,
    right: 0,
  },
});