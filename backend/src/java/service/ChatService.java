package service;

import dao.ChatDAO;
import dao.ChatParticipantDAO;
import dao.UserDAO;
import dto.ChatDTO;
import entity.Chat;
import entity.ChatParticipant;
import entity.User;
import entity.Message;
import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

public class ChatService {
    
    private ChatDAO chatDAO;
    private ChatParticipantDAO participantDAO;
    private UserDAO userDAO;
    
    public ChatService() {
        this.chatDAO = new ChatDAO();
        this.participantDAO = new ChatParticipantDAO();
        this.userDAO = new UserDAO();
    }
    
    public ChatDTO createIndividualChat(Long user1Id, Long user2Id) {
        try {
            // Check if chat already exists between these users
            Chat existingChat = chatDAO.findIndividualChat(user1Id, user2Id);
            if (existingChat != null) {
                return convertToDTO(existingChat);
            }
            
            User user1 = userDAO.getUserById(user1Id.intValue());
            User user2 = userDAO.getUserById(user2Id.intValue());
            
            if (user1 == null || user2 == null) {
                throw new RuntimeException("One or both users not found");
            }
            
            // Create new chat
            Chat chat = new Chat();
            chat.setChatType(Chat.ChatType.INDIVIDUAL);
            chat.setChatName(user2.getDisplayName());
            chat.setCreatedBy(user1);
            
            Long chatId = chatDAO.save(chat);
            chat.setId(chatId);
            
            // Add participants
            ChatParticipant participant1 = new ChatParticipant(chat, user1, ChatParticipant.Role.MEMBER);
            ChatParticipant participant2 = new ChatParticipant(chat, user2, ChatParticipant.Role.MEMBER);
            
            participantDAO.save(participant1);
            participantDAO.save(participant2);
            
            return convertToDTO(chat);
            
        } catch (Exception e) {
            throw new RuntimeException("Failed to create chat: " + e.getMessage());
        }
    }
    
    public ChatDTO createGroupChat(Long creatorId, String groupName, List<Long> participantIds, String description) {
        try {
            User creator = userDAO.getUserById(creatorId.intValue());
            if (creator == null) {
                throw new RuntimeException("Creator user not found");
            }
            
            // Create group chat
            Chat chat = new Chat();
            chat.setChatType(Chat.ChatType.GROUP);
            chat.setChatName(groupName);
            chat.setCreatedBy(creator);
            
            Long chatId = chatDAO.save(chat);
            chat.setId(chatId);
            
            // Add creator as admin
            ChatParticipant creatorParticipant = new ChatParticipant(chat, creator, ChatParticipant.Role.ADMIN);
            participantDAO.save(creatorParticipant);
            
            // Add other participants
            for (Long participantId : participantIds) {
                User participant = userDAO.getUserById(participantId.intValue());
                if (participant != null && !participantId.equals(creatorId)) {
                    ChatParticipant chatParticipant = new ChatParticipant(chat, participant, ChatParticipant.Role.MEMBER);
                    participantDAO.save(chatParticipant);
                }
            }
            
            return convertToDTO(chat);
            
        } catch (Exception e) {
            throw new RuntimeException("Failed to create group chat: " + e.getMessage());
        }
    }
    
    public List<ChatDTO> getUserChats(Long userId) {
        try {
            List<Chat> chats = chatDAO.findChatsByUserId(userId);
            return chats.stream()
                    .map(this::convertToDTO)
                    .collect(Collectors.toList());
        } catch (Exception e) {
            throw new RuntimeException("Failed to get user chats: " + e.getMessage());
        }
    }
    
    public ChatDTO getChatById(Long chatId) {
        try {
            Chat chat = chatDAO.findById(chatId);
            if (chat == null) {
                throw new RuntimeException("Chat not found");
            }
            return convertToDTO(chat);
        } catch (Exception e) {
            throw new RuntimeException("Failed to get chat: " + e.getMessage());
        }
    }
    
    public void addParticipantToGroup(Long chatId, Long userId, Long adminId) {
        try {
            Chat chat = chatDAO.findById(chatId);
            User user = userDAO.getUserById(userId.intValue());
            ChatParticipant admin = participantDAO.findByChatAndUser(chatId, adminId);
            
            if (chat == null || user == null) {
                throw new RuntimeException("Chat or user not found");
            }
            
            if (chat.getChatType() != Chat.ChatType.GROUP) {
                throw new RuntimeException("Can only add participants to group chats");
            }
            
            if (admin == null || admin.getRole() != ChatParticipant.Role.ADMIN) {
                throw new RuntimeException("Only admins can add participants");
            }
            
            // Check if user is already a participant
            ChatParticipant existing = participantDAO.findByChatAndUser(chatId, userId);
            if (existing != null) {
                throw new RuntimeException("User is already a participant");
            }
            
            ChatParticipant participant = new ChatParticipant(chat, user, ChatParticipant.Role.MEMBER);
            participantDAO.save(participant);
            
        } catch (Exception e) {
            throw new RuntimeException("Failed to add participant: " + e.getMessage());
        }
    }
    
    public void removeParticipantFromGroup(Long chatId, Long userId, Long adminId) {
        try {
            ChatParticipant participant = participantDAO.findByChatAndUser(chatId, userId);
            ChatParticipant admin = participantDAO.findByChatAndUser(chatId, adminId);
            
            if (participant == null) {
                throw new RuntimeException("Participant not found");
            }
            
            if (admin == null || admin.getRole() != ChatParticipant.Role.ADMIN) {
                throw new RuntimeException("Only admins can remove participants");
            }
            
            // Cannot remove yourself if you're the only admin
            if (userId.equals(adminId)) {
                long adminCount = participantDAO.countAdminsInChat(chatId);
                if (adminCount <= 1) {
                    throw new RuntimeException("Cannot remove the only admin from the group");
                }
            }
            
            participantDAO.delete(participant);
            
        } catch (Exception e) {
            throw new RuntimeException("Failed to remove participant: " + e.getMessage());
        }
    }
    
    public void updateChatLastMessage(Long chatId, Message message) {
        try {
            Chat chat = chatDAO.findById(chatId);
            if (chat != null) {
                chat.setLastMessageAt(new Date());
                chatDAO.update(chat);
            }
        } catch (Exception e) {
            throw new RuntimeException("Failed to update chat last message: " + e.getMessage());
        }
    }
    
    public List<User> getChatParticipants(Long chatId) {
        try {
            return participantDAO.findUsersByChatId(chatId);
        } catch (Exception e) {
            throw new RuntimeException("Failed to get chat participants: " + e.getMessage());
        }
    }
    
    public boolean isUserInChat(Long chatId, Long userId) {
        try {
            ChatParticipant participant = participantDAO.findByChatAndUser(chatId, userId);
            return participant != null;
        } catch (Exception e) {
            return false;
        }
    }
    
    public void updateChatName(Long chatId, Long userId, String newName) {
        try {
            Chat chat = chatDAO.findById(chatId);
            if (chat == null) {
                throw new RuntimeException("Chat not found");
            }
            
            // Check if user has permission to update chat name
            ChatParticipant participant = participantDAO.findByChatAndUser(chatId, userId);
            if (participant == null || participant.getRole() != ChatParticipant.Role.ADMIN) {
                throw new RuntimeException("Only admins can update chat name");
            }
            
            chat.setChatName(newName);
            chatDAO.update(chat);
            
        } catch (Exception e) {
            throw new RuntimeException("Failed to update chat name: " + e.getMessage());
        }
    }
    
    public void deleteChat(Long chatId, Long userId) {
        try {
            Chat chat = chatDAO.findById(chatId);
            if (chat == null) {
                throw new RuntimeException("Chat not found");
            }
            
            // Check if user has permission to delete chat
            ChatParticipant participant = participantDAO.findByChatAndUser(chatId, userId);
            if (participant == null || participant.getRole() != ChatParticipant.Role.ADMIN) {
                throw new RuntimeException("Only admins can delete chat");
            }
            
            // Delete all participants first
            List<ChatParticipant> participants = participantDAO.findByChatId(chatId);
            for (ChatParticipant p : participants) {
                participantDAO.delete(p);
            }
            
            // Delete the chat
            chatDAO.delete(chat);
            
        } catch (Exception e) {
            throw new RuntimeException("Failed to delete chat: " + e.getMessage());
        }
    }
    
    private ChatDTO convertToDTO(Chat chat) {
        ChatDTO dto = new ChatDTO();
        dto.setId(chat.getId());
        dto.setChatType(chat.getChatType().toString());
        dto.setChatName(chat.getChatName());
        dto.setCreatedAt(chat.getCreatedAt());
        dto.setLastMessageAt(chat.getLastMessageAt());
        dto.setCreatedById(chat.getCreatedBy().getId());
        dto.setCreatedByName(chat.getCreatedBy().getDisplayName());
        
        // Get participants count
        List<User> participants = getChatParticipants(chat.getId());
        dto.setParticipantsCount(participants != null ? participants.size() : 0);
        
        return dto;
    }
}