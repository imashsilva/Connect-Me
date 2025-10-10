package dto;

import java.util.Date;

public class ContactDTO {

    private Long id;
    private Long userId;
    private Long contactUserId;
    private String contactName;
    private Boolean isBlocked;
    private Date createdAt;
    private String contactUsername;
    private String contactDisplayName;
    private String contactProfilePicture;
    private String contactStatus;
    private Boolean contactIsOnline;
    private Date contactLastSeen;

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public Long getContactUserId() {
        return contactUserId;
    }

    public void setContactUserId(Long contactUserId) {
        this.contactUserId = contactUserId;
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

    public String getContactUsername() {
        return contactUsername;
    }

    public void setContactUsername(String contactUsername) {
        this.contactUsername = contactUsername;
    }

    public String getContactDisplayName() {
        return contactDisplayName;
    }

    public void setContactDisplayName(String contactDisplayName) {
        this.contactDisplayName = contactDisplayName;
    }

    public String getContactProfilePicture() {
        return contactProfilePicture;
    }

    public void setContactProfilePicture(String contactProfilePicture) {
        this.contactProfilePicture = contactProfilePicture;
    }

    public String getContactStatus() {
        return contactStatus;
    }

    public void setContactStatus(String contactStatus) {
        this.contactStatus = contactStatus;
    }

    public Boolean getContactIsOnline() {
        return contactIsOnline;
    }

    public void setContactIsOnline(Boolean contactIsOnline) {
        this.contactIsOnline = contactIsOnline;
    }

    public Date getContactLastSeen() {
        return contactLastSeen;
    }

    public void setContactLastSeen(Date contactLastSeen) {
        this.contactLastSeen = contactLastSeen;
    }
}
