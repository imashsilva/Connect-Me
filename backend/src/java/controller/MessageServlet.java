package controller;

import dto.ApiResponse;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import com.google.gson.Gson;
import dao.MessageDAO;
import entity.Message;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.List;

@WebServlet("/api/messages/*")
public class MessageServlet extends HttpServlet {
    private MessageDAO messageDAO = new MessageDAO();
    private Gson gson = new Gson();
    
    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) 
            throws IOException {
        
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        PrintWriter out = response.getWriter();
        
        try {
            // Send message
            Message message = gson.fromJson(request.getReader(), Message.class);
            boolean sent = messageDAO.sendMessage(message);
            
            if (sent) {
                response.setStatus(HttpServletResponse.SC_CREATED);
                out.print(gson.toJson(new ApiResponse("Message sent", true)));
            } else {
                response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
                out.print(gson.toJson(new ApiResponse("Failed to send message", false)));
            }
            
        } catch (Exception e) {
            e.printStackTrace();
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            out.print(gson.toJson(new ApiResponse("Error sending message", false)));
        }
    }
    
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) 
            throws IOException {
        
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        PrintWriter out = response.getWriter();
        
        String pathInfo = request.getPathInfo();
        
        try {
            if (pathInfo != null && pathInfo.startsWith("/")) {
                // Get messages between two users: /api/messages/{userId1}/{userId2}
                String[] pathParts = pathInfo.split("/");
                if (pathParts.length == 3) {
                    int user1 = Integer.parseInt(pathParts[1]);
                    int user2 = Integer.parseInt(pathParts[2]);
                    
                    List<Message> messages = messageDAO.getMessagesBetweenUsers(user1, user2);
                    out.print(gson.toJson(messages));
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            out.print(gson.toJson(new ApiResponse("Error fetching messages", false)));
        }
    }
}