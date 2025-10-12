package controller;

import dto.ApiResponse;
import util.JsonUtil;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

@WebServlet("/api/health")
public class HealthServlet extends HttpServlet {
    
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
        
        try {
            Map<String, Object> healthData = new HashMap<>();
            healthData.put("status", "OK");
            healthData.put("service", "ConnectMe Backend");
            healthData.put("timestamp", new Date());
            healthData.put("version", "1.0.0");
            
            healthData.put("database", checkDatabaseHealth());
            
            response.getWriter().write(JsonUtil.toJson(
                ApiResponse.success("Service is healthy", healthData)));
            
        } catch (Exception e) {
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            response.getWriter().write(JsonUtil.toJson(
                ApiResponse.error("Service health check failed")));
        }
    }
    
    private String checkDatabaseHealth() {
        try {
            config.HibernateUtil.getSessionFactory().getCurrentSession();
            return "CONNECTED";
        } catch (Exception e) {
            return "DISCONNECTED";
        }
    }
}