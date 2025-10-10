package websocket;

import javax.websocket.Session;
import java.io.IOException;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

public class WebSocketSessionManager {
    
    private static WebSocketSessionManager instance;
    private final Map<Long, Session> userSessions;
    
    private WebSocketSessionManager() {
        userSessions = new ConcurrentHashMap<>();
    }
    
    public static WebSocketSessionManager getInstance() {
        if (instance == null) {
            synchronized (WebSocketSessionManager.class) {
                if (instance == null) {
                    instance = new WebSocketSessionManager();
                }
            }
        }
        return instance;
    }
    
    public void addUserSession(Long userId, Session session) {
        userSessions.put(userId, session);
        System.out.println("User " + userId + " connected. Total connections: " + userSessions.size());
    }
    
    public void removeUserSession(Long userId) {
        userSessions.remove(userId);
        System.out.println("User " + userId + " disconnected. Total connections: " + userSessions.size());
    }
    
    public Session getUserSession(Long userId) {
        return userSessions.get(userId);
    }
    
    public boolean isUserOnline(Long userId) {
        Session session = userSessions.get(userId);
        return session != null && session.isOpen();
    }
    
    public void sendMessageToUser(Long userId, String event, String message) {
        Session session = userSessions.get(userId);
        if (session != null && session.isOpen()) {
            try {
                String fullMessage = "{\"event\":\"" + event + "\",\"data\":" + message + "}";
                session.getBasicRemote().sendText(fullMessage);
            } catch (IOException e) {
                System.err.println("Failed to send message to user " + userId + ": " + e.getMessage());
                // Remove stale session
                userSessions.remove(userId);
            }
        }
    }
    
    public void broadcastToAll(String event, String message) {
        String fullMessage = "{\"event\":\"" + event + "\",\"data\":" + message + "}";
        
        userSessions.entrySet().removeIf(entry -> {
            Session session = entry.getValue();
            if (session.isOpen()) {
                try {
                    session.getBasicRemote().sendText(fullMessage);
                    return false;
                } catch (IOException e) {
                    System.err.println("Failed to broadcast to user " + entry.getKey());
                    return true;
                }
            }
            return true;
        });
    }
    
    public int getConnectedUsersCount() {
        return userSessions.size();
    }
}