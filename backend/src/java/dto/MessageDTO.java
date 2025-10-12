package dto;

import java.util.Date;

public class MessageDTO {
    private Long id;
    private Long chatId;
    private Long senderId;
    private String senderName;
    private String messageType;
    private String content;
    private String mediaUrl;
    private Long fileSize;
    private Date createdAt;
    private Boolean isEdited;
    private Long replyToMessageId;
    private String replyToMessageContent;
    private Long replyToSenderId;
    private String replyToSenderName;

    // Constructors
    public MessageDTO() { }

    public MessageDTO(Long id, Long chatId, Long senderId, String senderName, 
                     String messageType, String content, String mediaUrl, 
                     Long fileSize, Date createdAt, Boolean isEdited, 
                     Long replyToMessageId) {
        this.id = id;
        this.chatId = chatId;
        this.senderId = senderId;
        this.senderName = senderName;
        this.messageType = messageType;
        this.content = content;
        this.mediaUrl = mediaUrl;
        this.fileSize = fileSize;
        this.createdAt = createdAt;
        this.isEdited = isEdited;
        this.replyToMessageId = replyToMessageId;
    }

    public MessageDTO(Long id, Long chatId, Long senderId, String senderName, 
                     String messageType, String content, String mediaUrl, 
                     Long fileSize, Date createdAt, Boolean isEdited, 
                     Long replyToMessageId, String replyToMessageContent,
                     Long replyToSenderId, String replyToSenderName) {
        this.id = id;
        this.chatId = chatId;
        this.senderId = senderId;
        this.senderName = senderName;
        this.messageType = messageType;
        this.content = content;
        this.mediaUrl = mediaUrl;
        this.fileSize = fileSize;
        this.createdAt = createdAt;
        this.isEdited = isEdited;
        this.replyToMessageId = replyToMessageId;
        this.replyToMessageContent = replyToMessageContent;
        this.replyToSenderId = replyToSenderId;
        this.replyToSenderName = replyToSenderName;
    }
    
    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getChatId() {
        return chatId;
    }

    public void setChatId(Long chatId) {
        this.chatId = chatId;
    }

    public Long getSenderId() {
        return senderId;
    }

    public void setSenderId(Long senderId) {
        this.senderId = senderId;
    }

    public String getSenderName() {
        return senderName;
    }

    public void setSenderName(String senderName) {
        this.senderName = senderName;
    }

    public String getMessageType() {
        return messageType;
    }

    public void setMessageType(String messageType) {
        this.messageType = messageType;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public String getMediaUrl() {
        return mediaUrl;
    }

    public void setMediaUrl(String mediaUrl) {
        this.mediaUrl = mediaUrl;
    }

    public Long getFileSize() {
        return fileSize;
    }

    public void setFileSize(Long fileSize) {
        this.fileSize = fileSize;
    }

    public Date getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Date createdAt) {
        this.createdAt = createdAt;
    }

    public Boolean getIsEdited() {
        return isEdited;
    }

    public void setIsEdited(Boolean isEdited) {
        this.isEdited = isEdited;
    }

    public Long getReplyToMessageId() {
        return replyToMessageId;
    }

    public void setReplyToMessageId(Long replyToMessageId) {
        this.replyToMessageId = replyToMessageId;
    }

    public String getReplyToMessageContent() {
        return replyToMessageContent;
    }

    public void setReplyToMessageContent(String replyToMessageContent) {
        this.replyToMessageContent = replyToMessageContent;
    }

    public Long getReplyToSenderId() {
        return replyToSenderId;
    }

    public void setReplyToSenderId(Long replyToSenderId) {
        this.replyToSenderId = replyToSenderId;
    }

    public String getReplyToSenderName() {
        return replyToSenderName;
    }

    public void setReplyToSenderName(String replyToSenderName) {
        this.replyToSenderName = replyToSenderName;
    }

    @Override
    public String toString() {
        return "MessageDTO{" +
                "id=" + id +
                ", chatId=" + chatId +
                ", senderId=" + senderId +
                ", senderName='" + senderName + '\'' +
                ", messageType='" + messageType + '\'' +
                ", content='" + (content != null ? 
                    content.substring(0, Math.min(content.length(), 30)) : "null") + '\'' +
                ", createdAt=" + createdAt +
                '}';
    }
}