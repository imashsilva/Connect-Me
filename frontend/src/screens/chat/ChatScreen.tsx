import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { RouteProp, useRoute, useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../hooks/useTheme';
import { useChat } from '../../contexts/ChatContext';
import { useAuth } from '../../contexts/AuthContext';
import { Message } from '../../types/message';
import { ChatHeader } from '../../components/chat/ChatHeader';
import { MessageBubble } from './MessageBubble';
import { InputToolbar } from './InputToolbar';

type ChatScreenRouteProps = {
  params: {
    chatId: string;
    chatName: string;
  };
};

export const ChatScreen: React.FC = () => {
  const route = useRoute<RouteProp<ChatScreenRouteProps, 'params'>>();
  const navigation = useNavigation();
  const { colors } = useTheme();
  const { user } = useAuth();
  const { messages, loadMessages, sendMessage, activeChat, isLoading, isSending } = useChat();
  
  const { chatId, chatName } = route.params;
  const [inputText, setInputText] = useState('');
  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    loadMessages(parseInt(chatId));
  }, [chatId]);

  const handleSendMessage = () => {
    if (!inputText.trim()) return;
    
    sendMessage(parseInt(chatId), inputText);
    setInputText('');
    
    // Scroll to bottom
    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };

  const getOtherParticipant = () => {
    if (!activeChat || activeChat.chatType === 'GROUP') {
      return null;
    }
    
    return activeChat.participants.find(p => p.user.id !== user?.id)?.user || null;
  };

  const isSameSender = (current: Message, previous: Message | null): boolean => {
    if (!previous) return false;
    return current.senderId === previous.senderId;
  };

  const shouldShowAvatar = (current: Message, next: Message | null): boolean => {
    if (!next) return true;
    return current.senderId !== next.senderId;
  };

  const renderMessage = ({ item, index }: { item: Message; index: number }) => {
    const previousMessage = index > 0 ? messages[index - 1] : null;
    const nextMessage = index < messages.length - 1 ? messages[index + 1] : null;
    
    const isOwnMessage = item.senderId === user?.id;
    const showAvatar = !isOwnMessage && shouldShowAvatar(item, nextMessage);
    const showTime = !isSameSender(item, nextMessage);

    return (
      <MessageBubble
        message={item}
        isOwnMessage={isOwnMessage}
        showAvatar={showAvatar}
        showTime={showTime}
        onLongPress={() => handleMessageLongPress(item)}
      />
    );
  };

  const handleMessageLongPress = (message: Message) => {
    if (message.senderId === user?.id) {
      Alert.alert(
        'Message Options',
        'What would you like to do?',
        [
          {
            text: 'Delete',
            style: 'destructive',
            onPress: () => deleteMessage(message.id),
          },
          {
            text: 'Edit',
            onPress: () => editMessage(message),
          },
          {
            text: 'Cancel',
            style: 'cancel',
          },
        ]
      );
    } else {
      Alert.alert(
        'Message Options',
        'What would you like to do?',
        [
          {
            text: 'Reply',
            onPress: () => replyToMessage(message),
          },
          {
            text: 'Copy',
            onPress: () => copyMessage(message.content),
          },
          {
            text: 'Cancel',
            style: 'cancel',
          },
        ]
      );
    }
  };

  const deleteMessage = async (messageId: number) => {
    try {
      // await chatAPI.deleteMessage(messageId);
      // Remove from local state
      // setMessages(prev => prev.filter(msg => msg.id !== messageId));
      Alert.alert('Success', 'Message deleted');
    } catch (error) {
      Alert.alert('Error', 'Failed to delete message');
    }
  };

  const editMessage = (message: Message) => {
    setInputText(message.content);
    // In real app, you'd set editing state and message ID
  };

  const replyToMessage = (message: Message) => {
    Alert.alert('Reply', `Replying to: ${message.content}`);
  };

  const copyMessage = (content: string) => {
    Alert.alert('Copied!', 'Message copied to clipboard');
  };

  const otherUser = getOtherParticipant();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Chat Header */}
      {otherUser && (
        <ChatHeader 
          user={otherUser} 
          isOnline={otherUser.isOnline} 
        />
      )}

      {/* Messages List */}
      <KeyboardAvoidingView
        style={styles.messagesContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        <FlatList
          ref={flatListRef}
          data={messages}
          renderItem={renderMessage}
          keyExtractor={item => item.id.toString()}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.messagesList}
          onContentSizeChange={() => flatListRef.current?.scrollToEnd()}
          onLayout={() => flatListRef.current?.scrollToEnd()}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Text style={[styles.emptyText, { color: colors.subtitle }]}>
                {isLoading ? 'Loading messages...' : 'No messages yet'}
              </Text>
            </View>
          }
        />
      </KeyboardAvoidingView>

      {/* Input Toolbar */}
      <InputToolbar
        value={inputText}
        onChangeText={setInputText}
        onSendMessage={handleSendMessage}
        disabled={isSending}
        placeholder="Type a message..."
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  messagesContainer: {
    flex: 1,
  },
  messagesList: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 16,
    textAlign: 'center',
  },
});