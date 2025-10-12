package controller;

import service.ChatService;
import dto.ChatDTO;
import dto.ApiResponse;
import util.JsonUtil;
import util.JwtUtil;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;
import service.ServiceFactory;

@WebServlet("/api/chats/*")
public class ChatServlet extends HttpServlet {

    private ChatService chatService = ServiceFactory.getChatService();
    private JwtUtil jwtUtil;

    @Override
    public void init() throws ServletException {
        this.chatService = new ChatService();
        this.jwtUtil = new JwtUtil();
    }

    private void setCORSHeaders(HttpServletResponse response) {
        response.setHeader("Access-Control-Allow-Origin", "*");
        response.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
        response.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization, Accept");
        response.setHeader("Access-Control-Max-Age", "3600");
    }

    @Override
    protected void doOptions(HttpServletRequest request, HttpServletResponse response) {
        setCORSHeaders(response);
        response.setStatus(HttpServletResponse.SC_OK);
    }

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        setCORSHeaders(response);
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");

        String userId = getUserIdFromToken(request);
        if (userId == null) {
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.getWriter().write(JsonUtil.toJson(
                    ApiResponse.error("Authentication required")));
            return;
        }

        String pathInfo = request.getPathInfo();

        try {
            if (pathInfo == null || pathInfo.equals("/")) {
                List<ChatDTO> chats = chatService.getUserChats(Long.parseLong(userId));
                response.getWriter().write(JsonUtil.toJson(
                        ApiResponse.success(chats)));

            } else {
                String[] pathParts = pathInfo.split("/");
                if (pathParts.length == 2) {
                    Long chatId = Long.parseLong(pathParts[1]);
                    ChatDTO chat = chatService.getChatById(chatId);
                    response.getWriter().write(JsonUtil.toJson(
                            ApiResponse.success(chat)));
                } else {
                    response.setStatus(HttpServletResponse.SC_NOT_FOUND);
                    response.getWriter().write(JsonUtil.toJson(
                            ApiResponse.error("Endpoint not found")));
                }
            }

        } catch (RuntimeException e) {
            response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            response.getWriter().write(JsonUtil.toJson(
                    ApiResponse.error(e.getMessage())));
        } catch (Exception e) {
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            response.getWriter().write(JsonUtil.toJson(
                    ApiResponse.error("Server error: " + e.getMessage())));
        }
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        setCORSHeaders(response);
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");

        String userId = getUserIdFromToken(request);
        if (userId == null) {
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.getWriter().write(JsonUtil.toJson(
                    ApiResponse.error("Authentication required")));
            return;
        }

        String pathInfo = request.getPathInfo();
        Long currentUserId = Long.parseLong(userId);

        try {
            if (pathInfo == null || pathInfo.equals("/")) {
                CreateChatRequest createRequest = JsonUtil.fromJson(
                        request.getReader(), CreateChatRequest.class);

                ChatDTO chat = chatService.createIndividualChat(
                        currentUserId,
                        createRequest.getOtherUserId()
                );

                response.setStatus(HttpServletResponse.SC_CREATED);
                response.getWriter().write(JsonUtil.toJson(
                        ApiResponse.success("Chat created successfully", chat)));

            } else if (pathInfo.equals("/group")) {
                CreateGroupRequest groupRequest = JsonUtil.fromJson(
                        request.getReader(), CreateGroupRequest.class);

                ChatDTO chat = chatService.createGroupChat(
                        currentUserId,
                        groupRequest.getGroupName(),
                        groupRequest.getParticipantIds(),
                        groupRequest.getDescription()
                );

                response.setStatus(HttpServletResponse.SC_CREATED);
                response.getWriter().write(JsonUtil.toJson(
                        ApiResponse.success("Group created successfully", chat)));

            } else if (pathInfo.matches("/\\d+/participants")) {
                String[] pathParts = pathInfo.split("/");
                Long chatId = Long.parseLong(pathParts[1]);

                AddParticipantRequest addRequest = JsonUtil.fromJson(
                        request.getReader(), AddParticipantRequest.class);

                chatService.addParticipantToGroup(
                        chatId,
                        addRequest.getUserId(),
                        currentUserId
                );

                response.getWriter().write(JsonUtil.toJson(
                        ApiResponse.success("Participant added successfully", null)));

            } else {
                response.setStatus(HttpServletResponse.SC_NOT_FOUND);
                response.getWriter().write(JsonUtil.toJson(
                        ApiResponse.error("Endpoint not found")));
            }

        } catch (RuntimeException e) {
            response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            response.getWriter().write(JsonUtil.toJson(
                    ApiResponse.error(e.getMessage())));
        } catch (Exception e) {
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            response.getWriter().write(JsonUtil.toJson(
                    ApiResponse.error("Server error: " + e.getMessage())));
        }
    }

    @Override
    protected void doDelete(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        setCORSHeaders(response);
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");

        String userId = getUserIdFromToken(request);
        if (userId == null) {
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.getWriter().write(JsonUtil.toJson(
                    ApiResponse.error("Authentication required")));
            return;
        }

        String pathInfo = request.getPathInfo();
        Long currentUserId = Long.parseLong(userId);

        try {
            if (pathInfo.matches("/\\d+/participants/\\d+")) {
                String[] pathParts = pathInfo.split("/");
                Long chatId = Long.parseLong(pathParts[1]);
                Long participantId = Long.parseLong(pathParts[3]);

                chatService.removeParticipantFromGroup(
                        chatId,
                        participantId,
                        currentUserId
                );

                response.getWriter().write(JsonUtil.toJson(
                        ApiResponse.success("Participant removed successfully", null)));

            } else {
                response.setStatus(HttpServletResponse.SC_NOT_FOUND);
                response.getWriter().write(JsonUtil.toJson(
                        ApiResponse.error("Endpoint not found")));
            }

        } catch (RuntimeException e) {
            response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            response.getWriter().write(JsonUtil.toJson(
                    ApiResponse.error(e.getMessage())));
        } catch (Exception e) {
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            response.getWriter().write(JsonUtil.toJson(
                    ApiResponse.error("Server error: " + e.getMessage())));
        }
    }

    private String getUserIdFromToken(HttpServletRequest request) {
        String authHeader = request.getHeader("Authorization");
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String token = authHeader.substring(7);
            return jwtUtil.validateToken(token);
        }
        return null;
    }

    private static class CreateChatRequest {

        private Long otherUserId;

        public Long getOtherUserId() {
            return otherUserId;
        }

        public void setOtherUserId(Long otherUserId) {
            this.otherUserId = otherUserId;
        }
    }

    private static class CreateGroupRequest {

        private String groupName;
        private List<Long> participantIds;
        private String description;

        public String getGroupName() {
            return groupName;
        }

        public void setGroupName(String groupName) {
            this.groupName = groupName;
        }

        public List<Long> getParticipantIds() {
            return participantIds;
        }

        public void setParticipantIds(List<Long> participantIds) {
            this.participantIds = participantIds;
        }

        public String getDescription() {
            return description;
        }

        public void setDescription(String description) {
            this.description = description;
        }
    }

    private static class AddParticipantRequest {

        private Long userId;

        public Long getUserId() {
            return userId;
        }

        public void setUserId(Long userId) {
            this.userId = userId;
        }
    }
}
