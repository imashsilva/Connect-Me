package filter;

import javax.servlet.*;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

public class AuthFilter implements Filter {
    
    @Override
    public void init(FilterConfig filterConfig) throws ServletException {
    }

    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
            throws IOException, ServletException {
        
        HttpServletRequest httpRequest = (HttpServletRequest) request;
        HttpServletResponse httpResponse = (HttpServletResponse) response;
        
        String path = httpRequest.getRequestURI();
        String method = httpRequest.getMethod();
        
        String authHeader = httpRequest.getHeader("Authorization");
        System.out.println("🔍 AuthFilter - Path: " + path + ", Method: " + method + ", Auth: " + authHeader);
        
        // Skip authentication for public endpoints
        if (isPublicEndpoint(path, method)) {
            System.out.println("✅ AuthFilter - Allowing public endpoint: " + path);
            chain.doFilter(request, response);
            return;
        }
        
        // For temporary tokens, allow all requests with Bearer token
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String token = authHeader.substring(7);
            System.out.println("✅ AuthFilter - Token found: " + token.substring(0, Math.min(20, token.length())) + "...");
            System.out.println("✅ AuthFilter - Allowing request to: " + path);
            chain.doFilter(request, response);
            return;
        }
        
        // No auth header - return 401
        System.out.println("❌ AuthFilter - No valid Authorization header for: " + path);
        httpResponse.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
        httpResponse.setContentType("application/json");
        httpResponse.getWriter().write("{\"success\":false,\"message\":\"Authentication required\"}");
    }

    @Override
    public void destroy() {
    }
    
    private boolean isPublicEndpoint(String path, String method) {
        // Allow OPTIONS requests (preflight)
        if ("OPTIONS".equalsIgnoreCase(method)) {
            return true;
        }
        
        // Allow auth endpoints
        if (path.contains("/api/auth/")) {
            return true;
        }
        
        // Allow health check
        if (path.contains("/health")) {
            return true;
        }
        
        // Allow debug endpoints
        if (path.contains("/api/debug/")) {
            return true;
        }
        
        // Allow root
        if (path.equals("/") || path.endsWith("/api/")) {
            return true;
        }
        
        return false;
    }
}