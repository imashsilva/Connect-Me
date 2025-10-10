package entity;

import java.util.Date;
import javax.persistence.*;

@Entity
@Table(name = "chat_participants", 
       uniqueConstraints = @UniqueConstraint(columnNames = {"chat_id", "user_id"}))
public class ChatParticipant {
    
    public enum Role {
        ADMIN, MEMBER
    }
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "chat_id", nullable = false)
    private Chat chat;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
    
    @Temporal(TemporalType.TIMESTAMP)
    @Column(name = "joined_at")
    private Date joinedAt;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "role", length = 10)
    private Role role = Role.MEMBER;
    
    @Column(name = "is_muted")
    private Boolean isMuted = false;
    
    // Constructors
    public ChatParticipant() {
        this.joinedAt = new Date();
    }
    
    public ChatParticipant(Chat chat, User user) {
        this();
        this.chat = chat;
        this.user = user;
    }
    
    public ChatParticipant(Chat chat, User user, Role role) {
        this(chat, user);
        this.role = role;
    }
    
    // PrePersist callback
    @PrePersist
    protected void onCreate() {
        if (joinedAt == null) {
            joinedAt = new Date();
        }
    }
    
    // Getters and Setters
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public Chat getChat() {
        return chat;
    }
    
    public void setChat(Chat chat) {
        this.chat = chat;
    }
    
    public User getUser() {
        return user;
    }
    
    public void setUser(User user) {
        this.user = user;
    }
    
    public Date getJoinedAt() {
        return joinedAt;
    }
    
    public void setJoinedAt(Date joinedAt) {
        this.joinedAt = joinedAt;
    }
    
    public Role getRole() {
        return role;
    }
    
    public void setRole(Role role) {
        this.role = role;
    }
    
    public Boolean getIsMuted() {
        return isMuted;
    }
    
    public void setIsMuted(Boolean isMuted) {
        this.isMuted = isMuted;
    }
    
    @Override
    public String toString() {
        return "ChatParticipant{" +
                "id=" + id +
                ", chatId=" + (chat != null ? chat.getId() : "null") +
                ", userId=" + (user != null ? user.getId() : "null") +
                ", role=" + role +
                '}';
    }
}