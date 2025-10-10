package entity;

import java.util.Date;
import javax.persistence.*;

@Entity
@Table(name = "message_status", 
       uniqueConstraints = @UniqueConstraint(columnNames = {"message_id", "user_id"})) 
public class MessageStatus {
    
    public enum Status {
        SENT, DELIVERED, READ
    }
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "message_id", nullable = false)
    private Message message;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "status", length = 10)
    private Status status = Status.SENT;
    
    @Temporal(TemporalType.TIMESTAMP)
    @Column(name = "updated_at")
    private Date updatedAt;
    
    // Constructors
    public MessageStatus() {
        this.updatedAt = new Date();
    }
    
    public MessageStatus(Message message, User user) {
        this();
        this.message = message;
        this.user = user;
    }
    
    public MessageStatus(Message message, User user, Status status) {
        this(message, user);
        this.status = status;
    }
    
    // PrePersist and PreUpdate callbacks
    @PrePersist
    protected void onCreate() {
        if (updatedAt == null) {
            updatedAt = new Date();
        }
    }
    
    @PreUpdate
    protected void onUpdate() {
        updatedAt = new Date();
    }
    
    // Getters and Setters
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public Message getMessage() {
        return message;
    }
    
    public void setMessage(Message message) {
        this.message = message;
    }
    
    public User getUser() {
        return user;
    }
    
    public void setUser(User user) {
        this.user = user;
    }
    
    public Status getStatus() {
        return status;
    }
    
    public void setStatus(Status status) {
        this.status = status;
        this.updatedAt = new Date();
    }
    
    public Date getUpdatedAt() {
        return updatedAt;
    }
    
    public void setUpdatedAt(Date updatedAt) {
        this.updatedAt = updatedAt;
    }
    
    @Override
    public String toString() {
        return "MessageStatus{" +
                "id=" + id +
                ", messageId=" + (message != null ? message.getId() : "null") +
                ", userId=" + (user != null ? user.getId() : "null") +
                ", status=" + status +
                ", updatedAt=" + updatedAt +
                '}';
    }
}