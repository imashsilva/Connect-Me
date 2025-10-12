package entity;

import java.util.Date;
import javax.persistence.*;

@Entity
@Table(name = "contacts", 
       uniqueConstraints = @UniqueConstraint(columnNames = {"user_id", "contact_user_id"}))
public class Contact {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "contact_user_id", nullable = false)
    private User contactUser;
    
    @Column(name = "contact_name", length = 100)
    private String contactName;
    
    @Column(name = "is_blocked")
    private Boolean isBlocked = false;
    
    @Temporal(TemporalType.TIMESTAMP)
    @Column(name = "created_at")
    private Date createdAt;
    
    // Constructors
    public Contact() {
        this.createdAt = new Date();
    }
    
    public Contact(User user, User contactUser) {
        this();
        this.user = user;
        this.contactUser = contactUser;
        this.contactName = contactUser.getDisplayName() != null ? 
                          contactUser.getDisplayName() : contactUser.getUsername();
    }
    
    public Contact(User user, User contactUser, String contactName) {
        this(user, contactUser);
        this.contactName = contactName;
    }
    
    // PrePersist callback
    @PrePersist
    protected void onCreate() {
        if (createdAt == null) {
            createdAt = new Date();
        }
        // Set default contact name if not provided
        if (contactName == null && contactUser != null) {
            contactName = contactUser.getDisplayName() != null ? 
                         contactUser.getDisplayName() : contactUser.getUsername();
        }
    }
    
    // Getters and Setters
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public User getUser() {
        return user;
    }
    
    public void setUser(User user) {
        this.user = user;
    }
    
    public User getContactUser() {
        return contactUser;
    }
    
    public void setContactUser(User contactUser) {
        this.contactUser = contactUser;
    }
    
    public String getContactName() {
        return contactName;
    }
    
    public void setContactName(String contactName) {
        this.contactName = contactName;
    }
    
    public Boolean getIsBlocked() {
        return isBlocked;
    }
    
    public void setIsBlocked(Boolean isBlocked) {
        this.isBlocked = isBlocked;
    }
    
    public Date getCreatedAt() {
        return createdAt;
    }
    
    public void setCreatedAt(Date createdAt) {
        this.createdAt = createdAt;
    }
    
    @Override
    public String toString() {
        return "Contact{" +
                "id=" + id +
                ", userId=" + (user != null ? user.getId() : "null") +
                ", contactUserId=" + (contactUser != null ? contactUser.getId() : "null") +
                ", contactName='" + contactName + '\'' +
                ", isBlocked=" + isBlocked +
                '}';
    }
}