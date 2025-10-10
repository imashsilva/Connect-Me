package controller;

import service.ContactService;
import dto.ContactDTO;
import dto.ApiResponse;
import util.JsonUtil;
import util.JwtUtil;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.List;

@WebServlet("/api/contacts/*")
public class ContactServlet extends HttpServlet {

    private ContactService contactService;
    private JwtUtil jwtUtil;

    @Override
    public void init() throws ServletException {
        this.contactService = new ContactService();
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

        try {
            List<ContactDTO> contacts = contactService.getUserContacts(Long.parseLong(userId));
            response.getWriter().write(JsonUtil.toJson(
                    ApiResponse.success(contacts)));

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

        try {
            AddContactRequest addRequest = JsonUtil.fromJson(
                    request.getReader(), AddContactRequest.class);

            ContactDTO contact = contactService.addContact(
                    Long.parseLong(userId),
                    addRequest.getContactUserId(),
                    addRequest.getContactName()
            );

            response.setStatus(HttpServletResponse.SC_CREATED);
            response.getWriter().write(JsonUtil.toJson(
                    ApiResponse.success("Contact added successfully", contact)));

        } catch (RuntimeException e) {
            response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            response.getWriter().write(JsonUtil.toJson(
                    ApiResponse.error("Failed to add contact: " + e.getMessage())));
        } catch (Exception e) {
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            response.getWriter().write(JsonUtil.toJson(
                    ApiResponse.error("Server error: " + e.getMessage())));
        }
    }

    @Override
    protected void doPut(HttpServletRequest request, HttpServletResponse response)
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
            if (pathInfo.matches("/\\d+/block")) {
                String[] pathParts = pathInfo.split("/");
                Long contactId = Long.parseLong(pathParts[1]);

                contactService.blockContact(Long.parseLong(userId), contactId);

                response.getWriter().write(JsonUtil.toJson(
                        ApiResponse.success("Contact blocked successfully", null)));

            } else if (pathInfo.matches("/\\d+/unblock")) {
                String[] pathParts = pathInfo.split("/");
                Long contactId = Long.parseLong(pathParts[1]);

                contactService.unblockContact(Long.parseLong(userId), contactId);

                response.getWriter().write(JsonUtil.toJson(
                        ApiResponse.success("Contact unblocked successfully", null)));

            } else if (pathInfo.matches("/\\d+/name")) {
                String[] pathParts = pathInfo.split("/");
                Long contactId = Long.parseLong(pathParts[1]);

                UpdateContactNameRequest updateRequest = JsonUtil.fromJson(
                        request.getReader(), UpdateContactNameRequest.class);

                ContactDTO updatedContact = contactService.updateContactName(
                        Long.parseLong(userId),
                        contactId,
                        updateRequest.getContactName()
                );

                response.getWriter().write(JsonUtil.toJson(
                        ApiResponse.success("Contact name updated successfully", updatedContact)));

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

        try {
            if (pathInfo.matches("/\\d+")) {
                String[] pathParts = pathInfo.split("/");
                Long contactId = Long.parseLong(pathParts[1]);

                contactService.removeContact(Long.parseLong(userId), contactId);

                response.getWriter().write(JsonUtil.toJson(
                        ApiResponse.success("Contact removed successfully", null)));

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

        String devUserId = request.getHeader("X-User-ID");
        if (devUserId != null) {
            return devUserId;
        }

        return null;
    }

    public static class AddContactRequest {

        private Long contactUserId;
        private String contactName;

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
    }

    public static class UpdateContactNameRequest {

        private String contactName;

        public String getContactName() {
            return contactName;
        }

        public void setContactName(String contactName) {
            this.contactName = contactName;
        }
    }
}