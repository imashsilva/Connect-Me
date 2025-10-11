import { useEffect, useState, useRef, useCallback } from 'react';
import { webSocketService } from '../services/websocket/WebSocketService';
import { useAuth } from '../contexts/AuthContext'; // You'll need to create this hook

export const useWebSocket = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [lastMessage, setLastMessage] = useState<any>(null);
  const { user, token } = useAuth(); // Get user from your auth context

  useEffect(() => {
    if (user && token) {
      // Connect to WebSocket when user is authenticated
      webSocketService.connect(user.id, token);
    }

    // Listen for connection changes
    const handleConnectionChange = (connected: boolean) => {
      setIsConnected(connected);
    };

    webSocketService.onConnectionChange(handleConnectionChange);

    // Listen for new messages
    const handleNewMessage = (message: any) => {
      setLastMessage(message);
      // You can add additional logic here, like updating chat state
    };

    webSocketService.on('message', handleNewMessage);

    // Cleanup on unmount
    return () => {
      webSocketService.off('message', handleNewMessage);
      // Don't disconnect here - keep connection alive during app usage
    };
  }, [user, token]);

  const sendMessage = useCallback((chatId: string, content: string, messageType: string = 'TEXT') => {
    return webSocketService.sendChatMessage(chatId, content, messageType);
  }, []);

  const sendTyping = useCallback((chatId: string, isTyping: boolean) => {
    return webSocketService.sendTyping(chatId, isTyping);
  }, []);

  const markAsRead = useCallback((messageId: string) => {
    return webSocketService.markMessageAsRead(messageId);
  }, []);

  return {
    isConnected,
    lastMessage,
    sendMessage,
    sendTyping,
    markAsRead,
    connectionStatus: webSocketService.getConnectionStatus()
  };
};