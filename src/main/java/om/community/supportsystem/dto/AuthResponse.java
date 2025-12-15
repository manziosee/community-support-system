package om.community.supportsystem.dto;

import om.community.supportsystem.model.User;

public class AuthResponse {
    private String token;
    private String refreshToken;
    private User user;
    private boolean requiresTwoFactor;
    private String message;
    
    public AuthResponse() {}
    
    public AuthResponse(String token, User user) {
        this.token = token;
        this.user = user;
    }
    
    public AuthResponse(String message, boolean requiresTwoFactor) {
        this.message = message;
        this.requiresTwoFactor = requiresTwoFactor;
    }
    
    // Getters and setters
    public String getToken() { return token; }
    public void setToken(String token) { this.token = token; }
    
    public String getRefreshToken() { return refreshToken; }
    public void setRefreshToken(String refreshToken) { this.refreshToken = refreshToken; }
    
    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }
    
    public boolean isRequiresTwoFactor() { return requiresTwoFactor; }
    public void setRequiresTwoFactor(boolean requiresTwoFactor) { this.requiresTwoFactor = requiresTwoFactor; }
    
    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }
}