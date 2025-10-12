package dto;

public class ApiResponse {
    private String message;
    private boolean success;
    private Object data;
    
    public ApiResponse() {}
    
    public ApiResponse(String message, boolean success) {
        this.message = message;
        this.success = success;
    }
    
    public ApiResponse(String message, boolean success, Object data) {
        this.message = message;
        this.success = success;
        this.data = data;
    }
    
    // Static factory methods for success
    public static ApiResponse success(String message) {
        return new ApiResponse(message, true);
    }
    
    public static ApiResponse success(String message, Object data) {
        return new ApiResponse(message, true, data);
    }
    
    public static ApiResponse success(Object data) {
        return new ApiResponse("Operation successful", true, data);
    }
    
    // Static factory methods for error
    public static ApiResponse error(String message) {
        return new ApiResponse(message, false);
    }
    
    public static ApiResponse error(String message, Object data) {
        return new ApiResponse(message, false, data);
    }
    
    // Getters and setters
    public String getMessage() { 
        return message; 
    }
    
    public void setMessage(String message) { 
        this.message = message; 
    }
    
    public boolean isSuccess() { 
        return success; 
    }
    
    public void setSuccess(boolean success) { 
        this.success = success; 
    }
    
    public Object getData() { 
        return data; 
    }
    
    public void setData(Object data) { 
        this.data = data; 
    }
}