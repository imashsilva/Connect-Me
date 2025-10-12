package dto;

import java.util.Date;

public class ChatDTO {

    private Long id;
    private String chatType;
    private String chatName;
    private Date createdAt;
    private Date lastMessageAt;
    private Integer participantsCount;
    private String lastMessageContent;
    private Date lastMessageTime;
    private Long lastMessageSenderId;
    private String lastMessageSenderName;
    private Long createdById;
    private String createdByName;

    // Constructors
    public ChatDTO() { }

    public ChatDTO(Long id, String chatType, String chatName, Date createdAt, 
                  Date lastMessageAt, Integer participantsCount) {
        this.id = id;
        this.chatType = chatType;
        this.chatName = chatName;
        this.createdAt = createdAt;
        this.lastMessageAt = lastMessageAt;
        this.participantsCount = participantsCount;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getChatType() {
        return chatType;
    }

    public void setChatType(String chatType) {
        this.chatType = chatType;
    }

    public String getChatName() {
        return chatName;
    }

    public void setChatName(String chatName) {
        this.chatName = chatName;
    }

    public Date getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Date createdAt) {
        this.createdAt = createdAt;
    }

    public Date getLastMessageAt() {
        return lastMessageAt;
    }

    public void setLastMessageAt(Date lastMessageAt) {
        this.lastMessageAt = lastMessageAt;
    }

    public Integer getParticipantsCount() {
        return participantsCount;
    }

    public void setParticipantsCount(Integer participantsCount) {
        this.participantsCount = participantsCount;
    }

    public String getLastMessageContent() {
        return lastMessageContent;
    }

    public void setLastMessageContent(String lastMessageContent) {
        this.lastMessageContent = lastMessageContent;
    }

    public Date getLastMessageTime() {
        return lastMessageTime;
    }

    public void setLastMessageTime(Date lastMessageTime) {
        this.lastMessageTime = lastMessageTime;
    }

    public Long getLastMessageSenderId() {
        return lastMessageSenderId;
    }

    public void setLastMessageSenderId(Long lastMessageSenderId) {
        this.lastMessageSenderId = lastMessageSenderId;
    }

    public String getLastMessageSenderName() {
        return lastMessageSenderName;
    }

    public void setLastMessageSenderName(String lastMessageSenderName) {
        this.lastMessageSenderName = lastMessageSenderName;
    }

    public Long getCreatedById() {
        return createdById;
    }

    public void setCreatedById(Long createdById) {
        this.createdById = createdById;
    }

    public String getCreatedByName() {
        return createdByName;
    }

    public void setCreatedByName(String createdByName) {
        this.createdByName = createdByName;
    }

    @Override
    public String toString() {
        return "ChatDTO{" +
                "id=" + id +
                ", chatType='" + chatType + '\'' +
                ", chatName='" + chatName + '\'' +
                ", participantsCount=" + participantsCount +
                ", lastMessageContent='" + (lastMessageContent != null ? 
                    lastMessageContent.substring(0, Math.min(lastMessageContent.length(), 20)) : "null") + '\'' +
                '}';
    }
}