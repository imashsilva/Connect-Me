import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../hooks/useTheme';
import { Avatar } from '../../components/common/Avatar';
import { Message, MessageStatus } from '../../types/message';

interface MessageBubbleProps {
  message: Message;
  isOwnMessage: boolean;
  showAvatar: boolean;
  showTime: boolean;
  onLongPress: () => void;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({
  message,
  isOwnMessage,
  showAvatar,
  showTime,
  onLongPress,
}) => {
  const { colors } = useTheme();

  const getStatusIcon = (status: MessageStatus) => {
    switch (status) {
      case 'SENT':
        return 'checkmark';
      case 'DELIVERED':
        return 'checkmark-done';
      case 'READ':
        return 'checkmark-done';
      default:
        return 'time';
    }
  };

  const getStatusColor = (status: MessageStatus) => {
    switch (status) {
      case 'READ':
        return '#10B981';
      case 'DELIVERED':
        return '#6B7280';
      case 'SENT':
        return '#6B7280';
      default:
        return '#9CA3AF';
    }
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <View
      style={[
        styles.container,
        isOwnMessage ? styles.ownContainer : styles.otherContainer,
      ]}
    >
      {/* Other user's avatar */}
      {!isOwnMessage && showAvatar && (
        <View style={styles.avatar}>
          <Avatar user={message.sender} size={32} />
        </View>
      )}

      {/* Message content */}
      <View style={styles.messageContent}>
        {!isOwnMessage && showAvatar && (
          <Text style={[styles.senderName, { color: colors.text }]}>
            {message.sender.displayName}
          </Text>
        )}

        <TouchableOpacity
          style={[
            styles.bubble,
            isOwnMessage
              ? [styles.ownBubble, { backgroundColor: colors.primary }]
              : [styles.otherBubble, { backgroundColor: colors.card }],
          ]}
          onLongPress={onLongPress}
          delayLongPress={300}
        >
          <Text
            style={[
              styles.messageText,
              isOwnMessage ? styles.ownMessageText : styles.otherMessageText,
            ]}
          >
            {message.content}
          </Text>
        </TouchableOpacity>

        {/* Message status and time */}
        {(showTime || isOwnMessage) && (
          <View style={styles.footer}>
            <Text style={[styles.time, { color: colors.subtitle }]}>
              {formatTime(message.createdAt)}
            </Text>
            
            {isOwnMessage && message.status && (
              <Ionicons
                name={getStatusIcon(message.status)}
                size={14}
                color={getStatusColor(message.status)}
                style={styles.statusIcon}
              />
            )}
            
            {message.isEdited && (
              <Text style={[styles.edited, { color: colors.subtitle }]}>
                edited
              </Text>
            )}
          </View>
        )}
      </View>

      {/* Spacer for own messages to align properly */}
      {isOwnMessage && <View style={styles.spacer} />}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    marginVertical: 2,
    paddingHorizontal: 8,
  },
  ownContainer: {
    justifyContent: 'flex-end',
  },
  otherContainer: {
    justifyContent: 'flex-start',
  },
  avatar: {
    marginRight: 8,
    alignSelf: 'flex-end',
  },
  messageContent: {
    maxWidth: '70%',
    flexShrink: 1,
  },
  senderName: {
    fontSize: 12,
    fontWeight: '500',
    marginBottom: 2,
    marginLeft: 8,
  },
  bubble: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    marginBottom: 2,
  },
  ownBubble: {
    borderBottomRightRadius: 4,
  },
  otherBubble: {
    borderBottomLeftRadius: 4,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 20,
  },
  ownMessageText: {
    color: 'white',
  },
  otherMessageText: {
    color: '#1F2937',
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 12,
    marginTop: 2,
  },
  time: {
    fontSize: 11,
    marginRight: 4,
  },
  statusIcon: {
    marginRight: 4,
  },
  edited: {
    fontSize: 11,
    fontStyle: 'italic',
  },
  spacer: {
    width: 40, // Same as avatar width + margin
  },
});