package filter;

import util.JwtUtil;
import javax.servlet.*;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

public class AuthFilter implements Filter {
    
    private JwtUtil jwtUtil;
    
    @Override
    public void init(FilterConfig filterConfig) throws ServletException {
        this.jwtUtil = new JwtUtil();
    }

    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
            throws IOException, ServletException {
        
        HttpServletRequest httpRequest = (HttpServletRequest) request;
        HttpServletResponse httpResponse = (HttpServletResponse) response;
        
        String path = httpRequest.getRequestURI();
        
        // Skip authentication for public endpoints
        if (isPublicEndpoint(path)) {
            chain.doFilter(request, response);
            return;
        }
        
        // Check authentication
        String userId = getUserIdFromRequest(httpRequest);
        
        if (userId == null) {
            httpResponse.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            httpResponse.getWriter().write("{\"success\":false,\"error\":\"Authentication required\"}");
            return;
        }
        
        // Add user ID to request for servlets to use
        request.setAttribute("userId", userId);
        chain.doFilter(request, response);
    }

    @Override
    public void destroy() {
        // Cleanup if needed
    }
    
    private boolean isPublicEndpoint(String path) {
        return path.startsWith("/api/auth/") || 
               path.equals("/api/health") ||
               path.equals("/");
    }
    
    private String getUserIdFromRequest(HttpServletRequest request) {
        // Check Authorization header
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
}