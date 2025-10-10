package controller;

import util.FileUploadUtil;
import dto.ApiResponse;
import util.JsonUtil;
import util.JwtUtil;
import javax.servlet.ServletException;
import javax.servlet.annotation.MultipartConfig;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.Part;
import java.io.IOException;

@WebServlet("/api/upload/*")
@MultipartConfig(
    maxFileSize = 1024 * 1024 * 10,      // 10 MB
    maxRequestSize = 1024 * 1024 * 50,   // 50 MB
    fileSizeThreshold = 1024 * 1024      // 1 MB
)
public class UploadServlet extends HttpServlet {
    
    private JwtUtil jwtUtil;
    
    @Override
    public void init() throws ServletException {
        this.jwtUtil = new JwtUtil();
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        
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
                response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
                response.getWriter().write(JsonUtil.toJson(
                    ApiResponse.error("Upload type required")));
                return;
            }

            switch (pathInfo) {
                case "/profile":
                    handleProfileUpload(request, response, Long.parseLong(userId));
                    break;
                case "/media":
                    handleMediaUpload(request, response, Long.parseLong(userId));
                    break;
                default:
                    response.setStatus(HttpServletResponse.SC_NOT_FOUND);
                    response.getWriter().write(JsonUtil.toJson(
                        ApiResponse.error("Upload endpoint not found")));
            }

        } catch (Exception e) {
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            response.getWriter().write(JsonUtil.toJson(
                ApiResponse.error("Upload failed: " + e.getMessage())));
        }
    }

    private void handleProfileUpload(HttpServletRequest request, HttpServletResponse response, Long userId)
            throws IOException, ServletException {
        
        Part filePart = request.getPart("file");
        if (filePart == null) {
            response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            response.getWriter().write(JsonUtil.toJson(
                ApiResponse.error("No file provided")));
            return;
        }

        // Validate file type
        String fileName = filePart.getSubmittedFileName();
        if (!FileUploadUtil.isImageFile(fileName)) {
            response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            response.getWriter().write(JsonUtil.toJson(
                ApiResponse.error("Only image files are allowed for profile pictures")));
            return;
        }

        // Save file
        String filePath = FileUploadUtil.saveFile(filePart, "profiles");
        
        if (filePath != null) {
            // Update user profile picture in database
            // userService.updateProfilePicture(userId, filePath);
            
            response.getWriter().write(JsonUtil.toJson(
                ApiResponse.success("Profile picture uploaded successfully", 
                    new UploadResponse(filePath))));
        } else {
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            response.getWriter().write(JsonUtil.toJson(
                ApiResponse.error("Failed to upload profile picture")));
        }
    }

    private void handleMediaUpload(HttpServletRequest request, HttpServletResponse response, Long userId)
            throws IOException, ServletException {
        
        Part filePart = request.getPart("file");
        if (filePart == null) {
            response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            response.getWriter().write(JsonUtil.toJson(
                ApiResponse.error("No file provided")));
            return;
        }

        // Validate file type
        String fileName = filePart.getSubmittedFileName();
        if (!FileUploadUtil.isAllowedFileType(fileName)) {
            response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            response.getWriter().write(JsonUtil.toJson(
                ApiResponse.error("File type not allowed")));
            return;
        }

        // Save file
        String filePath = FileUploadUtil.saveFile(filePart, "media");
        
        if (filePath != null) {
            response.getWriter().write(JsonUtil.toJson(
                ApiResponse.success("File uploaded successfully", 
                    new UploadResponse(filePath))));
        } else {
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            response.getWriter().write(JsonUtil.toJson(
                ApiResponse.error("Failed to upload file")));
        }
    }

    private String getUserIdFromToken(HttpServletRequest request) {
        String authHeader = request.getHeader("Authorization");
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String token = authHeader.substring(7);
            return jwtUtil.validateToken(token);
        }
        
        // Development fallback
        String devUserId = request.getHeader("X-User-ID");
        if (devUserId != null) {
            return devUserId;
        }
        
        return null;
    }

    // Response DTO
    public static class UploadResponse {
        private String filePath;
        private String message;
        
        public UploadResponse(String filePath) {
            this.filePath = filePath;
            this.message = "Upload successful";
        }
        
        public String getFilePath() { return filePath; }
        public void setFilePath(String filePath) { this.filePath = filePath; }
        public String getMessage() { return message; }
        public void setMessage(String message) { this.message = message; }
    }
}
