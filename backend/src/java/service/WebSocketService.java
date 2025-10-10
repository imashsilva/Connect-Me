package service;

import dto.MessageDTO;
import util.JsonUtil;
import javax.websocket.Session;
import java.io.IOException;

public class WebSocketService {
    
    private UserService userService;
    private MessageService messageService;
    private ChatService chatService;
    
    public WebSocketService() {
        this.userService = new UserService();
        this.messageService = new MessageService();
        this.chatService = new ChatService();
    }
    
    public void handleUserConnection(Long userId, Session session) {
        try {
            // In a real implementation, you'd have a session manager
            // For now, just update user status
            userService.updateUserStatus(userId, true);
            
            // Notify others that user is online
            broadcastUserStatus(userId, true);
            
        } catch (Exception e) {
            System.err.println("Failed to handle user connection: " + e.getMessage());
        }
    }
    
    public void handleUserDisconnection(Long userId) {
        try {
            userService.updateUserStatus(userId, false);
            
            // Notify others that user is offline
            broadcastUserStatus(userId, false);
            
        } catch (Exception e) {
            System.err.println("Failed to handle user disconnection: " + e.getMessage());
        }
    }
    
    public void sendMessageToUser(Long userId, String event, Object data) {
        try {
            String message = JsonUtil.toJson(data);
            // In a real implementation, you'd send via WebSocket session
            System.out.println("Sending to user " + userId + ": " + event + " - " + message);
        } catch (Exception e) {
            System.err.println("Failed to send message to user: " + e.getMessage());
        }
    }
    
    public void broadcastToChatParticipants(Long chatId, String event, Object data, Long excludeUserId) {
        try {
            java.util.List<entity.User> participants = chatService.getChatParticipants(chatId);
            
            for (entity.User participant : participants) {
                if (excludeUserId == null || !participant.getId().equals(excludeUserId)) {
                    sendMessageToUser(participant.getId(), event, data);
                }
            }
        } catch (Exception e) {
            System.err.println("Failed to broadcast to chat participants: " + e.getMessage());
        }
    }
    
    public void handleNewMessage(MessageDTO messageDTO) {
        try {
            // Broadcast to all chat participants except sender
            broadcastToChatParticipants(
                messageDTO.getChatId(), 
                "new_message", 
                messageDTO, 
                messageDTO.getSenderId()
            );
            
        } catch (Exception e) {
            System.err.println("Failed to handle new message: " + e.getMessage());
        }
    }
    
    public void handleTypingIndicator(Long chatId, Long userId, boolean isTyping) {
        try {
            String event = isTyping ? "user_typing" : "user_stop_typing";
            Object data = new TypingData(chatId, userId, isTyping);
            
            broadcastToChatParticipants(chatId, event, data, userId);
            
        } catch (Exception e) {
            System.err.println("Failed to handle typing indicator: " + e.getMessage());
        }
    }
    
    public void handleMessageRead(Long messageId, Long userId) {
        try {
            messageService.markMessageAsRead(messageId, userId);
            
            // Notify sender that message was read
            MessageDTO message = messageService.getMessageById(messageId);
            if (message != null && !message.getSenderId().equals(userId)) {
                sendMessageToUser(message.getSenderId(), "message_read", 
                    new ReadReceiptData(messageId, userId));
            }
            
        } catch (Exception e) {
            System.err.println("Failed to handle message read: " + e.getMessage());
        }
    }
    
    private void broadcastUserStatus(Long userId, boolean isOnline) {
        try {
            dto.UserDTO userDTO = userService.getUserById(userId);
            
            Object statusData = new UserStatusData(
                userId, 
                userDTO.getDisplayName(), 
                isOnline, 
                userDTO.getLastSeen()
            );
            
            String event = isOnline ? "user_online" : "user_offline";
            
            // In a real implementation, broadcast to relevant users
            System.out.println("User " + userId + " is " + (isOnline ? "online" : "offline"));
            
        } catch (Exception e) {
            System.err.println("Failed to broadcast user status: " + e.getMessage());
        }
    }
    
    // Inner classes for WebSocket data
    private static class TypingData {
        public Long chatId;
        public Long userId;
        public boolean isTyping;
        
        public TypingData(Long chatId, Long userId, boolean isTyping) {
            this.chatId = chatId;
            this.userId = userId;
            this.isTyping = isTyping;
        }
    }
    
    private static class ReadReceiptData {
        public Long messageId;
        public Long userId;
        
        public ReadReceiptData(Long messageId, Long userId) {
            this.messageId = messageId;
            this.userId = userId;
        }
    }
    
    private static class UserStatusData {
        public Long userId;
        public String displayName;
        public boolean isOnline;
        public Object lastSeen;
        
        public UserStatusData(Long userId, String displayName, boolean isOnline, Object lastSeen) {
            this.userId = userId;
            this.displayName = displayName;
            this.isOnline = isOnline;
            this.lastSeen = lastSeen;
        }
    }
}