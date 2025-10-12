package entity;

import javax.persistence.*;

@Entity
@Table(name = "group_chat_details")
public class GroupChatDetails {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;
    
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "chat_id", nullable = false)
    private Chat chat;
    
    @Column(name = "group_description", columnDefinition = "TEXT")
    private String groupDescription;
    
    @Column(name = "group_picture", length = 255)
    private String groupPicture;
    
    @Column(name = "max_participants")
    private Integer maxParticipants = 256;
    
    // Constructors
    public GroupChatDetails() { }
    
    public GroupChatDetails(Chat chat) {
        this.chat = chat;
    }
    
    public GroupChatDetails(Chat chat, String groupDescription) {
        this.chat = chat;
        this.groupDescription = groupDescription;
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
    
    public String getGroupDescription() {
        return groupDescription;
    }
    
    public void setGroupDescription(String groupDescription) {
        this.groupDescription = groupDescription;
    }
    
    public String getGroupPicture() {
        return groupPicture;
    }
    
    public void setGroupPicture(String groupPicture) {
        this.groupPicture = groupPicture;
    }
    
    public Integer getMaxParticipants() {
        return maxParticipants;
    }
    
    public void setMaxParticipants(Integer maxParticipants) {
        this.maxParticipants = maxParticipants;
    }
    
    @Override
    public String toString() {
        return "GroupChatDetails{" +
                "id=" + id +
                ", chatId=" + (chat != null ? chat.getId() : "null") +
                ", groupDescription='" + (groupDescription != null ? 
                    groupDescription.substring(0, Math.min(groupDescription.length(), 50)) : "null") + '\'' +
                ", maxParticipants=" + maxParticipants +
                '}';
    }
}