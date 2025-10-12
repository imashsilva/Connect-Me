package service;

import dao.ContactDAO;
import dao.UserDAO;
import dto.ContactDTO;
import entity.Contact;
import entity.User;
import java.util.List;
import java.util.stream.Collectors;

public class ContactService {
    
    private ContactDAO contactDAO;
    private UserDAO userDAO;
    
    public ContactService() {
        this.contactDAO = new ContactDAO();
        this.userDAO = new UserDAO();
    }
    
    public ContactDTO addContact(Long userId, Long contactUserId, String contactName) {
        try {
            User user = userDAO.getUserById(userId.intValue());
            User contactUser = userDAO.getUserById(contactUserId.intValue());
            
            if (user == null || contactUser == null) {
                throw new RuntimeException("User or contact user not found");
            }
            
            if (userId.equals(contactUserId)) {
                throw new RuntimeException("Cannot add yourself as contact");
            }
            
            // Check if contact already exists
            Contact existingContact = contactDAO.findByUserAndContactUser(userId, contactUserId);
            if (existingContact != null) {
                throw new RuntimeException("Contact already exists");
            }
            
            Contact contact = new Contact(user, contactUser, contactName);
            Long contactId = contactDAO.save(contact);
            contact.setId(contactId);
            
            return convertToDTO(contact);
            
        } catch (Exception e) {
            throw new RuntimeException("Failed to add contact: " + e.getMessage());
        }
    }
    
    public List<ContactDTO> getUserContacts(Long userId) {
        try {
            List<Contact> contacts = contactDAO.findByUserId(userId);
            return contacts.stream()
                    .map(this::convertToDTO)
                    .collect(Collectors.toList());
        } catch (Exception e) {
            throw new RuntimeException("Failed to get contacts: " + e.getMessage());
        }
    }
    
    public void removeContact(Long userId, Long contactId) {
        try {
            Contact contact = contactDAO.findById(contactId);
            if (contact == null || !contact.getUser().getId().equals(userId)) {
                throw new RuntimeException("Contact not found or access denied");
            }
            
            contactDAO.delete(contact);
            
        } catch (Exception e) {
            throw new RuntimeException("Failed to remove contact: " + e.getMessage());
        }
    }
    
    public void blockContact(Long userId, Long contactId) {
        try {
            Contact contact = contactDAO.findById(contactId);
            if (contact == null || !contact.getUser().getId().equals(userId)) {
                throw new RuntimeException("Contact not found or access denied");
            }
            
            contact.setIsBlocked(true);
            contactDAO.update(contact);
            
        } catch (Exception e) {
            throw new RuntimeException("Failed to block contact: " + e.getMessage());
        }
    }
    
    public void unblockContact(Long userId, Long contactId) {
        try {
            Contact contact = contactDAO.findById(contactId);
            if (contact == null || !contact.getUser().getId().equals(userId)) {
                throw new RuntimeException("Contact not found or access denied");
            }
            
            contact.setIsBlocked(false);
            contactDAO.update(contact);
            
        } catch (Exception e) {
            throw new RuntimeException("Failed to unblock contact: " + e.getMessage());
        }
    }
    
    public ContactDTO updateContactName(Long userId, Long contactId, String newContactName) {
        try {
            Contact contact = contactDAO.findById(contactId);
            if (contact == null || !contact.getUser().getId().equals(userId)) {
                throw new RuntimeException("Contact not found or access denied");
            }
            
            contact.setContactName(newContactName);
            contactDAO.update(contact);
            
            return convertToDTO(contact);
            
        } catch (Exception e) {
            throw new RuntimeException("Failed to update contact name: " + e.getMessage());
        }
    }
    
    public boolean isContactBlocked(Long userId, Long contactUserId) {
        try {
            Contact contact = contactDAO.findByUserAndContactUser(userId, contactUserId);
            return contact != null && contact.getIsBlocked();
        } catch (Exception e) {
            return false;
        }
    }
    
    private ContactDTO convertToDTO(Contact contact) {
        ContactDTO dto = new ContactDTO();
        dto.setId(contact.getId());
        dto.setUserId(contact.getUser().getId());
        dto.setContactUserId(contact.getContactUser().getId());
        dto.setContactName(contact.getContactName());
        dto.setIsBlocked(contact.getIsBlocked());
        dto.setCreatedAt(contact.getCreatedAt());
        
        // Add contact user details
        User contactUser = contact.getContactUser();
        dto.setContactUsername(contactUser.getUsername());
        dto.setContactDisplayName(contactUser.getDisplayName());
        dto.setContactProfilePicture(contactUser.getProfilePicture());
        dto.setContactStatus(contactUser.getStatus());
        dto.setContactIsOnline(contactUser.getIsOnline());
        dto.setContactLastSeen(contactUser.getLastSeen());
        
        return dto;
    }
}