package entity;

import java.util.Date;
import javax.persistence.*;

@Entity
@Table(name = "chats")
public class Chat {
    
    public enum ChatType {
        INDIVIDUAL, GROUP
    }
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "chat_type", nullable = false, length = 10)
    private ChatType chatType;
    
    @Column(name = "chat_name", length = 100)
    private String chatName;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "created_by")
    private User createdBy;
    
    @Temporal(TemporalType.TIMESTAMP)
    @Column(name = "created_at")
    private Date createdAt;
    
    @Temporal(TemporalType.TIMESTAMP)
    @Column(name = "last_message_at")
    private Date lastMessageAt;
    
    // Constructors
    public Chat() {
        this.createdAt = new Date();
        this.lastMessageAt = new Date();
    }
    
    public Chat(ChatType chatType, User createdBy) {
        this();
        this.chatType = chatType;
        this.createdBy = createdBy;
    }
    
    // PrePersist callback
    @PrePersist
    protected void onCreate() {
        if (createdAt == null) {
            createdAt = new Date();
        }
        if (lastMessageAt == null) {
            lastMessageAt = new Date();
        }
    }
    
    // Getters and Setters
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public ChatType getChatType() {
        return chatType;
    }
    
    public void setChatType(ChatType chatType) {
        this.chatType = chatType;
    }
    
    public String getChatName() {
        return chatName;
    }
    
    public void setChatName(String chatName) {
        this.chatName = chatName;
    }
    
    public User getCreatedBy() {
        return createdBy;
    }
    
    public void setCreatedBy(User createdBy) {
        this.createdBy = createdBy;
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
    
    @Override
    public String toString() {
        return "Chat{" +
                "id=" + id +
                ", chatType=" + chatType +
                ", chatName='" + chatName + '\'' +
                ", createdAt=" + createdAt +
                '}';
    }
}