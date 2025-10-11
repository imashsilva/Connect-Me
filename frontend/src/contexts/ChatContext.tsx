import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { useAuth } from './AuthContext';
import { chatAPI } from '../services/api/chat';
import { socketService } from '../services/socket';
import { Chat } from '../types/chat';
import { Message } from '../types/message';

interface ChatContextType {
  chats: Chat[];
  activeChat: Chat | null;
  messages: Message[];
  isLoading: boolean;
  isSending: boolean;
  loadChats: () => Promise<void>;
  loadMessages: (chatId: number) => Promise<void>;
  sendMessage: (chatId: number, content: string, messageType?: string) => Promise<void>;
  setActiveChat: (chat: Chat | null) => void;
  markAsRead: (messageIds: number[]) => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

interface ChatProviderProps {
  children: ReactNode;
}

export const ChatProvider: React.FC<ChatProviderProps> = ({ children }) => {
  const [chats, setChats] = useState<Chat[]>([]);
  const [activeChat, setActiveChat] = useState<Chat | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated && user) {
      loadChats();
      setupSocketListeners();
    }

    return () => {
      // Cleanup socket listeners with proper callback removal
      socketService.off('new_message', handleNewMessage);
      socketService.off('message_sent', handleMessageSent);
      socketService.off('message_delivered', handleMessageDelivered);
      socketService.off('message_read', handleMessageRead);
    };
  }, [isAuthenticated, user]);

  // Socket event handlers
  const handleNewMessage = (newMessage: Message) => {
    setMessages(prev => [...prev, newMessage]);
    
    // Update chat list with new last message
    setChats(prev => 
      prev.map(chat => 
        chat.id === newMessage.chatId 
          ? { ...chat, lastMessage: newMessage, lastMessageAt: newMessage.createdAt }
          : chat
      )
    );
  };

  const handleMessageDelivered = (data: { messageId: number }) => {
    updateMessageStatus(data.messageId, 'DELIVERED');
  };

  const handleMessageRead = (data: { messageId: number }) => {
    updateMessageStatus(data.messageId, 'READ');
  };

  const handleMessageSent = (data: { messageId: number }) => {
    // Handle message sent confirmation if needed
    console.log('Message sent:', data.messageId);
  };

  const setupSocketListeners = () => {
    // Listen for new messages
    socketService.on('new_message', handleNewMessage);
    
    // Listen for message status updates
    socketService.on('message_delivered', handleMessageDelivered);
    socketService.on('message_read', handleMessageRead);
    socketService.on('message_sent', handleMessageSent);
  };

  const updateMessageStatus = (messageId: number, status: 'DELIVERED' | 'READ') => {
    setMessages(prev =>
      prev.map(msg =>
        msg.id === messageId ? { ...msg, status } : msg
      )
    );
  };

  const loadChats = async (): Promise<void> => {
    try {
      setIsLoading(true);
      const chatsData = await chatAPI.getChats();
      setChats(chatsData);
    } catch (error) {
      console.error('Error loading chats:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadMessages = async (chatId: number): Promise<void> => {
    try {
      setIsLoading(true);
      const messagesResponse = await chatAPI.getMessages(chatId);
      setMessages(messagesResponse.content);
      
      // Join chat room via WebSocket
      socketService.joinChat(chatId);
    } catch (error) {
      console.error('Error loading messages:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const sendMessage = async (chatId: number, content: string, messageType: string = 'TEXT'): Promise<void> => {
    if (!content.trim() || !user) return;

    // Declare tempMessageId at the function scope so it's accessible in catch block
    const tempMessageId = Date.now();

    try {
      setIsSending(true);
      
      // Create temporary message with proper structure
      const tempMessage: Message = {
        id: tempMessageId, // Use the scoped variable
        chatId,
        senderId: user.id,
        messageType: messageType as any,
        content: content.trim(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        isEdited: false,
        status: 'SENT',
        sender: {
          id: user.id,
          username: user.username,
          email: user.email,
          displayName: user.displayName,
          profilePicture: user.profilePicture,
          status: user.status,
          lastSeen: user.lastSeen,
          isOnline: user.isOnline,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
        },
      };

      // Optimistic update
      setMessages(prev => [...prev, tempMessage]);

      // Send via WebSocket for real-time
      socketService.sendMessage(chatId, content, messageType);

      // Also send via API for persistence
      const sentMessage = await chatAPI.sendMessage(chatId, {
        content: content.trim(),
        messageType: messageType as any,
      });

      // Replace temporary message with actual message from server
      setMessages(prev =>
        prev.map(msg =>
          msg.id === tempMessageId ? { ...sentMessage, status: 'DELIVERED' } : msg
        )
      );

      // Update chat list
      setChats(prev =>
        prev.map(chat =>
          chat.id === chatId
            ? { ...chat, lastMessage: { ...sentMessage, status: 'DELIVERED' }, lastMessageAt: sentMessage.createdAt }
            : chat
        )
      );

    } catch (error) {
      console.error('Error sending message:', error);
      // Remove optimistic message on error using the scoped tempMessageId
      setMessages(prev => prev.filter(msg => msg.id !== tempMessageId));
    } finally {
      setIsSending(false);
    }
  };

  const markAsRead = async (messageIds: number[]): Promise<void> => {
    try {
      await chatAPI.markAsRead(messageIds);
      socketService.markAsRead(messageIds);
    } catch (error) {
      console.error('Error marking messages as read:', error);
    }
  };

  const value: ChatContextType = {
    chats,
    activeChat,
    messages,
    isLoading,
    isSending,
    loadChats,
    loadMessages,
    sendMessage,
    setActiveChat,
    markAsRead,
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};

export const useChat = (): ChatContextType => {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};