package service;

import dao.MessageDAO;
import dao.MessageStatusDAO;
import dao.ChatDAO;
import dao.UserDAO;
import dao.ChatParticipantDAO;
import dto.MessageDTO;
import entity.Message;
import entity.MessageStatus;
import entity.Chat;
import entity.User;
import entity.ChatParticipant;
import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

public class MessageService {

    private MessageDAO messageDAO;
    private MessageStatusDAO messageStatusDAO;
    private ChatDAO chatDAO;
    private UserDAO userDAO;
    private ChatParticipantDAO participantDAO;

    public MessageService() {
        this.messageDAO = new MessageDAO();
        this.messageStatusDAO = new MessageStatusDAO();
        this.chatDAO = new ChatDAO();
        this.userDAO = new UserDAO();
        this.participantDAO = new ChatParticipantDAO();
    }

    public MessageDTO sendMessage(Long chatId, Long senderId, String content) {
        try {
            Chat chat = chatDAO.findById(chatId);
            User sender = userDAO.getUserById(senderId.intValue());

            if (chat == null || sender == null) {
                throw new RuntimeException("Chat or sender not found");
            }

            // Check if sender is a participant in the chat
            ChatParticipant participant = participantDAO.findByChatAndUser(chatId, senderId);
            if (participant == null) {
                throw new RuntimeException("User is not a participant in this chat");
            }

            Message message = new Message();
            message.setChat(chat);
            message.setSender(sender);
            message.setContent(content);
            message.setMessageType(Message.MessageType.TEXT);

            boolean sent = messageDAO.sendMessage(message);
            if (!sent) {
                throw new RuntimeException("Failed to send message");
            }

            // Update chat's last message timestamp
            chat.setLastMessageAt(new Date());
            chatDAO.update(chat);

            return convertToDTO(message);

        } catch (Exception e) {
            throw new RuntimeException("Failed to send message: " + e.getMessage());
        }
    }

    public MessageDTO getMessageById(Long messageId) {
        try {
            Message message = messageDAO.findById(messageId);
            if (message == null) {
                throw new RuntimeException("Message not found");
            }
            return convertToDTO(message);
        } catch (Exception e) {
            throw new RuntimeException("Failed to get message: " + e.getMessage());
        }
    }

    public List<MessageDTO> getMessagesBetweenUsers(int user1, int user2) {
        try {
            List<Message> messages = messageDAO.getMessagesBetweenUsers(user1, user2);
            return messages.stream()
                    .map(this::convertToDTO)
                    .collect(Collectors.toList());
        } catch (Exception e) {
            throw new RuntimeException("Failed to get messages: " + e.getMessage());
        }
    }

    public List<MessageDTO> getMessagesForUser(int userId) {
        try {
            List<Message> messages = messageDAO.getMessagesForUser(userId);
            return messages.stream()
                    .map(this::convertToDTO)
                    .collect(Collectors.toList());
        } catch (Exception e) {
            throw new RuntimeException("Failed to get messages: " + e.getMessage());
        }
    }

    public Message getLastMessageForChat(Long chatId) {
        try {
            // Simple implementation - get all messages and return the last one
            List<Message> messages = messageDAO.getMessagesForChat(chatId);
            if (messages != null && !messages.isEmpty()) {
                return messages.get(messages.size() - 1);
            }
            return null;
        } catch (Exception e) {
            return null;
        }
    }

    public void markMessageAsRead(Long messageId, Long userId) {
        try {
            // Simple implementation - just update the message
            Message message = messageDAO.findById(messageId);
            if (message != null) {
                // For now, we'll just return success
                // In a real implementation, you'd update message status
            }
        } catch (Exception e) {
            throw new RuntimeException("Failed to mark message as read: " + e.getMessage());
        }
    }

    private MessageDTO convertToDTO(Message message) {
        MessageDTO dto = new MessageDTO();
        dto.setId(message.getId());
        dto.setChatId(message.getChat().getId());
        dto.setSenderId(message.getSender().getId());
        dto.setSenderName(message.getSender().getDisplayName());
        dto.setMessageType(message.getMessageType().toString());
        dto.setContent(message.getContent());
        dto.setMediaUrl(message.getMediaUrl());
        dto.setFileSize(message.getFileSize());
        dto.setCreatedAt(message.getCreatedAt());
        dto.setIsEdited(message.getIsEdited());

        if (message.getReplyToMessageId() != null) {
            dto.setReplyToMessageId(message.getReplyToMessageId());
        }

        return dto;
    }
}