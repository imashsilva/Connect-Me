package controller;

import service.UserService;
import dto.AuthRequest;
import dto.AuthResponse;
import dto.ApiResponse;
import dto.UserDTO;
import util.JsonUtil;
import util.JwtUtil;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

@WebServlet("/api/auth/*")
public class AuthServlet extends HttpServlet {

    private UserService userService;
    private JwtUtil jwtUtil;

    @Override
    public void init() throws ServletException {
        this.userService = new UserService();
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
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        setCORSHeaders(response);
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");

        String pathInfo = request.getPathInfo();

        try {
            if (pathInfo == null || pathInfo.equals("/")) {
                response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
                response.getWriter().write(JsonUtil.toJson(
                        ApiResponse.error("Invalid endpoint")));
                return;
            }

            switch (pathInfo) {
                case "/register":
                    handleRegister(request, response);
                    break;
                case "/login":
                    handleLogin(request, response);
                    break;
                case "/logout":
                    handleLogout(request, response);
                    break;
                default:
                    response.setStatus(HttpServletResponse.SC_NOT_FOUND);
                    response.getWriter().write(JsonUtil.toJson(
                            ApiResponse.error("Endpoint not found")));
            }

        } catch (Exception e) {
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            response.getWriter().write(JsonUtil.toJson(
                    ApiResponse.error("Server error: " + e.getMessage())));
        }
    }

    private void handleRegister(HttpServletRequest request, HttpServletResponse response)
            throws IOException {

        try {
            AuthRequest authRequest = JsonUtil.fromJson(
                    request.getReader(), AuthRequest.class);

            if (authRequest.getEmail() == null || authRequest.getPassword() == null) {
                response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
                response.getWriter().write(JsonUtil.toJson(
                        ApiResponse.error("Email and password are required")));
                return;
            }

            String username = authRequest.getEmail().split("@")[0];

            UserDTO userDTO = userService.registerUser(
                    username,
                    authRequest.getEmail(),
                    authRequest.getPassword(),
                    username,
                    null
            );

            String token = jwtUtil.generateToken(userDTO.getId().toString());

            AuthResponse authResponse = new AuthResponse(token, userDTO);
            authResponse.setMessage("Registration successful");

            response.setStatus(HttpServletResponse.SC_CREATED);
            response.getWriter().write(JsonUtil.toJson(
                    ApiResponse.success("User registered successfully", authResponse)));

        } catch (RuntimeException e) {
            response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            response.getWriter().write(JsonUtil.toJson(
                    ApiResponse.error("Registration failed: " + e.getMessage())));
        }
    }

    private void handleLogin(HttpServletRequest request, HttpServletResponse response)
            throws IOException {

        try {
            AuthRequest authRequest = JsonUtil.fromJson(
                    request.getReader(), AuthRequest.class);

            if (authRequest.getEmail() == null || authRequest.getPassword() == null) {
                response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
                response.getWriter().write(JsonUtil.toJson(
                        ApiResponse.error("Email and password are required")));
                return;
            }

            UserDTO userDTO = userService.loginUser(
                    authRequest.getEmail(),
                    authRequest.getPassword()
            );

            String token = jwtUtil.generateToken(userDTO.getId().toString());

            AuthResponse authResponse = new AuthResponse(token, userDTO);
            authResponse.setMessage("Login successful");

            response.setStatus(HttpServletResponse.SC_OK);
            response.getWriter().write(JsonUtil.toJson(
                    ApiResponse.success("Login successful", authResponse)));

        } catch (RuntimeException e) {
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.getWriter().write(JsonUtil.toJson(
                    ApiResponse.error("Login failed: " + e.getMessage())));
        }
    }

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        setCORSHeaders(response);
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");

        String pathInfo = request.getPathInfo();

        if (pathInfo != null && pathInfo.equals("/health")) {
            Map<String, Object> healthData = new HashMap<>();
            healthData.put("status", "OK");
            healthData.put("service", "ConnectMe Backend");
            healthData.put("timestamp", new Date());

            response.getWriter().write(JsonUtil.toJson(
                    ApiResponse.success("Service is healthy", healthData)));
        } else {
            response.setStatus(HttpServletResponse.SC_NOT_FOUND);
            response.getWriter().write(JsonUtil.toJson(
                    ApiResponse.error("Endpoint not found")));
        }
    }

    private void handleLogout(HttpServletRequest request, HttpServletResponse response)
            throws IOException {

        try {
            String authHeader = request.getHeader("Authorization");
            if (authHeader != null && authHeader.startsWith("Bearer ")) {
                String token = authHeader.substring(7);
                String userId = jwtUtil.validateToken(token);

                if (userId != null) {
                    userService.logoutUser(Long.parseLong(userId));
                }
            }

            response.setStatus(HttpServletResponse.SC_OK);
            response.getWriter().write(JsonUtil.toJson(
                    ApiResponse.success("Logout successful")));

        } catch (Exception e) {
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            response.getWriter().write(JsonUtil.toJson(
                    ApiResponse.error("Logout failed: " + e.getMessage())));
        }
    }
}