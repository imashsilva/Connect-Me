package websocket;

import dto.MessageDTO;
import entity.Message;
import service.WebSocketService;
import service.MessageService;
import util.JsonUtil;
import util.JwtUtil;
import javax.websocket.*;
import javax.websocket.server.ServerEndpoint;
import java.io.IOException;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@ServerEndpoint("/chat")
public class ChatWebSocket {

    private static final Map<String, Long> sessionUserMap = new ConcurrentHashMap<>();
    private WebSocketService webSocketService;
    private MessageService messageService;
    private JwtUtil jwtUtil;

    public ChatWebSocket() {
        this.webSocketService = new WebSocketService();
        this.messageService = new MessageService();
        this.jwtUtil = new JwtUtil();
    }

    @OnOpen
    public void onOpen(Session session) {
        System.out.println("WebSocket connection opened: " + session.getId());

        // Get user ID from query parameters or token
        String queryString = session.getQueryString();
        Long userId = extractUserIdFromQuery(queryString);

        if (userId != null) {
            sessionUserMap.put(session.getId(), userId);
            webSocketService.handleUserConnection(userId, session);

            // Send connection confirmation
            sendMessage(session, "connection_established",
                    "{\"message\":\"WebSocket connection established\",\"userId\":" + userId + "}");
        } else {
            try {
                session.close(new CloseReason(CloseReason.CloseCodes.VIOLATED_POLICY, "Authentication required"));
            } catch (IOException e) {
                e.printStackTrace();
            }
        }
    }

    @OnMessage
    public void onMessage(String message, Session session) {
        try {
            Long userId = sessionUserMap.get(session.getId());
            if (userId == null) {
                return;
            }

            // Parse incoming message
            WebSocketMessage wsMessage = JsonUtil.fromJson(message, WebSocketMessage.class);

            switch (wsMessage.getEvent()) {
                case "send_message":
                    handleSendMessage(wsMessage.getData(), userId);
                    break;
                case "typing_start":
                    handleTypingStart(wsMessage.getData(), userId, true);
                    break;
                case "typing_stop":
                    handleTypingStart(wsMessage.getData(), userId, false);
                    break;
                case "mark_read":
                    handleMarkRead(wsMessage.getData(), userId);
                    break;
                case "mark_delivered":
                    handleMarkDelivered(wsMessage.getData(), userId);
                    break;
                default:
                    System.out.println("Unknown WebSocket event: " + wsMessage.getEvent());
            }

        } catch (Exception e) {
            System.err.println("Error processing WebSocket message: " + e.getMessage());
            sendMessage(session, "error", "{\"message\":\"Error processing message\"}");
        }
    }

    @OnClose
    public void onClose(Session session, CloseReason closeReason) {
        System.out.println("WebSocket connection closed: " + session.getId() + " - " + closeReason.getReasonPhrase());

        Long userId = sessionUserMap.remove(session.getId());
        if (userId != null) {
            webSocketService.handleUserDisconnection(userId);
        }
    }

    @OnError
    public void onError(Session session, Throwable error) {
        System.err.println("WebSocket error for session " + session.getId() + ": " + error.getMessage());

        Long userId = sessionUserMap.remove(session.getId());
        if (userId != null) {
            webSocketService.handleUserDisconnection(userId);
        }
    }

    private void handleSendMessage(Object data, Long userId) {
        try {
            SendMessageData messageData = JsonUtil.fromJson(
                    JsonUtil.toJson(data), SendMessageData.class);

            // Use MessageService to save and process the message
            MessageDTO messageDTO = messageService.sendMessage(
                    messageData.chatId,
                    userId,
                    messageData.content
            );

            // Broadcast via WebSocket
            webSocketService.handleNewMessage(messageDTO);

        } catch (Exception e) {
            System.err.println("Failed to handle send_message: " + e.getMessage());
        }
    }

    private void handleTypingStart(Object data, Long userId, boolean isTyping) {
        try {
            TypingData typingData = JsonUtil.fromJson(
                    JsonUtil.toJson(data), TypingData.class);

            webSocketService.handleTypingIndicator(
                    typingData.chatId, userId, isTyping);

        } catch (Exception e) {
            System.err.println("Failed to handle typing indicator: " + e.getMessage());
        }
    }

    private void handleMarkRead(Object data, Long userId) {
        try {
            MarkReadData readData = JsonUtil.fromJson(
                    JsonUtil.toJson(data), MarkReadData.class);

            webSocketService.handleMessageRead(readData.messageId, userId);

        } catch (Exception e) {
            System.err.println("Failed to handle mark_read: " + e.getMessage());
        }
    }

    private void handleMarkDelivered(Object data, Long userId) {
        try {
            MarkDeliveredData deliveredData = JsonUtil.fromJson(
                    JsonUtil.toJson(data), MarkDeliveredData.class);

            messageService.markMessageAsRead(deliveredData.messageId, userId);

        } catch (Exception e) {
            System.err.println("Failed to handle mark_delivered: " + e.getMessage());
        }
    }

    private Long extractUserIdFromQuery(String queryString) {
        if (queryString != null) {
            String[] params = queryString.split("&");
            for (String param : params) {
                String[] keyValue = param.split("=");
                if (keyValue.length == 2 && "userId".equals(keyValue[0])) {
                    try {
                        return Long.parseLong(keyValue[1]);
                    } catch (NumberFormatException e) {
                        return null;
                    }
                }
            }
        }
        return null;
    }

    private void sendMessage(Session session, String event, String data) {
        try {
            String message = "{\"event\":\"" + event + "\",\"data\":" + data + "}";
            session.getBasicRemote().sendText(message);
        } catch (IOException e) {
            System.err.println("Failed to send message to session " + session.getId() + ": " + e.getMessage());
        }
    }

    // WebSocket message classes
    public static class WebSocketMessage {
        private String event;
        private Object data;

        public String getEvent() {
            return event;
        }

        public void setEvent(String event) {
            this.event = event;
        }

        public Object getData() {
            return data;
        }

        public void setData(Object data) {
            this.data = data;
        }
    }

    public static class SendMessageData {
        public Long chatId;
        public String content;
        public String messageType;
        public String mediaUrl;
        public Long fileSize;
        public Long replyToMessageId;
    }

    public static class TypingData {
        public Long chatId;
    }

    public static class MarkReadData {
        public Long messageId;
    }

    public static class MarkDeliveredData {
        public Long messageId;
    }
}