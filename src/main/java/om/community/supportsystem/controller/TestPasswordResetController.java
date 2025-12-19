package om.community.supportsystem.controller;

import om.community.supportsystem.model.User;
import om.community.supportsystem.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;

import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/test-password-reset")
@Tag(name = "🔧 Test Password Reset", description = "Testing endpoints for password reset when email is unavailable")
@CrossOrigin(origins = {"http://localhost:3001", "http://localhost:5173", "https://community-support-system.vercel.app"}, allowCredentials = "true")
public class TestPasswordResetController {
    
    @Autowired
    private UserRepository userRepository;
    
    @Operation(summary = "Get reset token for email", description = "Get the current password reset token for an email (for testing when email service is unavailable)")
    @ApiResponse(responseCode = "200", description = "Reset token retrieved or not found")
    @GetMapping("/token/{email}")
    public ResponseEntity<?> getResetToken(@PathVariable String email) {
        try {
            Optional<User> userOpt = userRepository.findByEmail(email);
            if (userOpt.isEmpty()) {
                return ResponseEntity.ok(Map.of(
                    "message", "No user found with this email",
                    "email", email,
                    "hasToken", false
                ));
            }
            
            User user = userOpt.get();
            if (user.getPasswordResetToken() == null) {
                return ResponseEntity.ok(Map.of(
                    "message", "No active reset token for this user",
                    "email", email,
                    "hasToken", false
                ));
            }
            
            return ResponseEntity.ok(Map.of(
                "message", "Reset token found",
                "email", email,
                "hasToken", true,
                "token", user.getPasswordResetToken(),
                "resetUrl", "https://community-support-system.vercel.app/reset-password?token=" + user.getPasswordResetToken(),
                "expiresAt", user.getPasswordResetTokenExpiry() != null ? user.getPasswordResetTokenExpiry().toString() : "No expiry set"
            ));
            
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of(
                "error", "Failed to get reset token: " + e.getMessage(),
                "email", email
            ));
        }
    }
    
    @Operation(summary = "List all users with reset tokens", description = "Get all users who currently have active password reset tokens")
    @ApiResponse(responseCode = "200", description = "Users with reset tokens retrieved")
    @GetMapping("/active-tokens")
    public ResponseEntity<?> getActiveResetTokens() {
        try {
            var usersWithTokens = userRepository.findByPasswordResetTokenIsNotNull();
            
            var tokenInfo = usersWithTokens.stream()
                .map(user -> Map.of(
                    "email", user.getEmail(),
                    "name", user.getName(),
                    "token", user.getPasswordResetToken(),
                    "resetUrl", "https://community-support-system.vercel.app/reset-password?token=" + user.getPasswordResetToken(),
                    "expiresAt", user.getPasswordResetTokenExpiry() != null ? user.getPasswordResetTokenExpiry().toString() : "No expiry set"
                ))
                .toList();
            
            return ResponseEntity.ok(Map.of(
                "message", "Active reset tokens retrieved",
                "count", tokenInfo.size(),
                "tokens", tokenInfo
            ));
            
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of(
                "error", "Failed to get active tokens: " + e.getMessage()
            ));
        }
    }
    
    @Operation(summary = "Clear reset token", description = "Clear the password reset token for a user")
    @ApiResponse(responseCode = "200", description = "Reset token cleared")
    @DeleteMapping("/token/{email}")
    public ResponseEntity<?> clearResetToken(@PathVariable String email) {
        try {
            Optional<User> userOpt = userRepository.findByEmail(email);
            if (userOpt.isEmpty()) {
                return ResponseEntity.ok(Map.of(
                    "message", "No user found with this email",
                    "email", email
                ));
            }
            
            User user = userOpt.get();
            user.setPasswordResetToken(null);
            user.setPasswordResetTokenExpiry(null);
            userRepository.save(user);
            
            return ResponseEntity.ok(Map.of(
                "message", "Reset token cleared successfully",
                "email", email
            ));
            
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of(
                "error", "Failed to clear reset token: " + e.getMessage(),
                "email", email
            ));
        }
    }
}