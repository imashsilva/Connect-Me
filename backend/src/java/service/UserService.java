package service;

import dao.UserDAO;
import dto.UserDTO;
import entity.User;
import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

public class UserService {

    private UserDAO userDAO;

    public UserService() {
        this.userDAO = new UserDAO();
    }

    public UserDTO registerUser(String username, String email, String password, String displayName, String phoneNumber) {
        try {
            // Check if user already exists
            if (userDAO.getUserByUsername(username) != null) {
                throw new RuntimeException("Username already exists");
            }

            if (userDAO.findByEmail(email) != null) {
                throw new RuntimeException("Email already exists");
            }

            if (phoneNumber != null && !phoneNumber.isEmpty() && userDAO.findByPhone(phoneNumber) != null) {
                throw new RuntimeException("Phone number already exists");
            }

            // Create new user with plain password
            User user = new User();
            user.setUsername(username);
            user.setEmail(email);
            user.setPassword(password);
            user.setDisplayName(displayName != null ? displayName : username);
            user.setPhoneNumber(phoneNumber);
            user.setIsOnline(false);
            user.setLastSeen(new Date());
            user.setStatus("Hey there! I am using ConnectMe");

            boolean registered = userDAO.registerUser(user);
            if (!registered) {
                throw new RuntimeException("Failed to register user");
            }

            return convertToDTO(user);

        } catch (Exception e) {
            throw new RuntimeException("Registration failed: " + e.getMessage());
        }
    }

    public UserDTO loginUser(String email, String password) {
        try {
            System.out.println("🔍 Login attempt - Email: " + email);

            User user = userDAO.findByEmail(email);
            System.out.println("🔍 User found: " + (user != null));

            if (user == null) {
                System.out.println("❌ User not found for email: " + email);
                throw new RuntimeException("User not found");
            }

            System.out.println("🔍 Password check - Input: " + password + ", Stored: " + user.getPassword());

            // Direct password comparison (plain text)
            if (!password.equals(user.getPassword())) {
                System.out.println("❌ Password mismatch");
                throw new RuntimeException("Invalid password");
            }

            // Update user status
            user.setIsOnline(true);
            user.setLastSeen(new Date());
            userDAO.updateUser(user);

            System.out.println("✅ Login successful for user: " + user.getUsername());
            return convertToDTO(user);

        } catch (Exception e) {
            System.out.println("❌ Login failed: " + e.getMessage());
            throw new RuntimeException("Login failed: " + e.getMessage());
        }
    }

    public void logoutUser(Long userId) {
        try {
            User user = userDAO.getUserById(userId.intValue());
            if (user != null) {
                user.setIsOnline(false);
                user.setLastSeen(new Date());
                userDAO.updateUser(user);
            }
        } catch (Exception e) {
            throw new RuntimeException("Logout failed: " + e.getMessage());
        }
    }

    public UserDTO getUserById(Long userId) {
        try {
            User user = userDAO.getUserById(userId.intValue());
            if (user == null) {
                throw new RuntimeException("User not found");
            }
            return convertToDTO(user);
        } catch (Exception e) {
            throw new RuntimeException("Failed to get user: " + e.getMessage());
        }
    }

    public UserDTO updateUserProfile(Long userId, String displayName, String status, String phoneNumber) {
        try {
            User user = userDAO.getUserById(userId.intValue());
            if (user == null) {
                throw new RuntimeException("User not found");
            }

            if (displayName != null && !displayName.trim().isEmpty()) {
                user.setDisplayName(displayName);
            }

            if (status != null) {
                user.setStatus(status);
            }

            if (phoneNumber != null) {
                // Check if phone number is already taken by another user
                User existingUser = userDAO.findByPhone(phoneNumber);
                if (existingUser != null && !existingUser.getId().equals(userId)) {
                    throw new RuntimeException("Phone number already taken");
                }
                user.setPhoneNumber(phoneNumber);
            }

            userDAO.updateUser(user);
            return convertToDTO(user);

        } catch (Exception e) {
            throw new RuntimeException("Profile update failed: " + e.getMessage());
        }
    }

    public void updateProfilePicture(Long userId, String profilePictureUrl) {
        try {
            User user = userDAO.getUserById(userId.intValue());
            if (user != null) {
                user.setProfilePicture(profilePictureUrl);
                userDAO.updateUser(user);
            }
        } catch (Exception e) {
            throw new RuntimeException("Failed to update profile picture: " + e.getMessage());
        }
    }

    public List<UserDTO> searchUsers(String query) {
        try {
            List<User> users = userDAO.searchUsers(query);
            return users.stream()
                    .map(this::convertToDTO)
                    .collect(Collectors.toList());
        } catch (Exception e) {
            throw new RuntimeException("Search failed: " + e.getMessage());
        }
    }

    public List<UserDTO> getOnlineUsers() {
        try {
            List<User> users = userDAO.findOnlineUsers();
            return users.stream()
                    .map(this::convertToDTO)
                    .collect(Collectors.toList());
        } catch (Exception e) {
            throw new RuntimeException("Failed to get online users: " + e.getMessage());
        }
    }

    public void updateUserStatus(Long userId, boolean isOnline) {
        try {
            User user = userDAO.getUserById(userId.intValue());
            if (user != null) {
                user.setIsOnline(isOnline);
                user.setLastSeen(new Date());
                userDAO.updateUser(user);
            }
        } catch (Exception e) {
            throw new RuntimeException("Failed to update user status: " + e.getMessage());
        }
    }

    public boolean validateUserCredentials(Long userId) {
        try {
            User user = userDAO.getUserById(userId.intValue());
            return user != null;
        } catch (Exception e) {
            return false;
        }
    }

    // Add missing methods that UserDAO should have
    public User findByEmail(String email) {
        try {
            // This is a simple implementation - you might need to add this to UserDAO
            List<User> allUsers = userDAO.getAllUsers();
            for (User user : allUsers) {
                if (email.equals(user.getEmail())) {
                    return user;
                }
            }
            return null;
        } catch (Exception e) {
            return null;
        }
    }

    private UserDTO convertToDTO(User user) {
        UserDTO dto = new UserDTO();
        dto.setId(user.getId());
        dto.setUsername(user.getUsername());
        dto.setEmail(user.getEmail());
        dto.setPhoneNumber(user.getPhoneNumber());
        dto.setDisplayName(user.getDisplayName());
        dto.setProfilePicture(user.getProfilePicture());
        dto.setStatus(user.getStatus());
        dto.setLastSeen(user.getLastSeen());
        dto.setIsOnline(user.getIsOnline());
        return dto;
    }
}
