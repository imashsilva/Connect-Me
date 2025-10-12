package service;

public class ServiceFactory {
    
    private static ChatService chatService;
    private static MessageService messageService;
    private static UserService userService;
    private static ContactService contactService;
    private static WebSocketService webSocketService;
    
    public static synchronized ChatService getChatService() {
        if (chatService == null) {
            chatService = new ChatService();
            // Set dependencies if needed
            if (messageService != null) {
                // chatService.setMessageService(messageService);
            }
        }
        return chatService;
    }
    
    public static synchronized MessageService getMessageService() {
        if (messageService == null) {
            messageService = new MessageService();
            // Set dependencies if needed
            if (chatService != null) {
                // messageService.setChatService(chatService);
            }
        }
        return messageService;
    }
    
    public static synchronized UserService getUserService() {
        if (userService == null) {
            userService = new UserService();
        }
        return userService;
    }
    
    public static synchronized ContactService getContactService() {
        if (contactService == null) {
            contactService = new ContactService();
        }
        return contactService;
    }
    
    public static synchronized WebSocketService getWebSocketService() {
        if (webSocketService == null) {
            webSocketService = new WebSocketService();
        }
        return webSocketService;
    }
    
    public static synchronized void clearCache() {
        chatService = null;
        messageService = null;
        userService = null;
        contactService = null;
        webSocketService = null;
    }
}