package om.community.supportsystem.controller;

import om.community.supportsystem.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;

import java.util.Map;

@RestController
@RequestMapping("/api/settings")
@Tag(name = "⚙️ User Settings", description = "Complete user settings management - Profile updates, password changes, and notification preferences")
public class SettingsController {
    
    @Autowired
    private UserService userService;
    
    @Operation(summary = "Update user password", description = "Change user password with current password verification")
    @ApiResponse(responseCode = "200", description = "Password updated successfully")
    @PatchMapping("/password/{userId}")
    public ResponseEntity<?> updatePassword(
            @PathVariable Long userId,
            @RequestBody Map<String, String> passwordData) {
        try {
            String currentPassword = passwordData.get("currentPassword");
            String newPassword = passwordData.get("newPassword");
            String confirmPassword = passwordData.get("confirmPassword");
            
            if (currentPassword == null || currentPassword.trim().isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("error", "Current password is required"));
            }
            
            if (newPassword == null || newPassword.trim().isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("error", "New password is required"));
            }
            
            if (confirmPassword != null && !newPassword.equals(confirmPassword)) {
                return ResponseEntity.badRequest().body(Map.of("error", "New passwords do not match"));
            }
            
            userService.updatePassword(userId, currentPassword, newPassword);
            return ResponseEntity.ok(Map.of("message", "Password updated successfully"));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
    
    @Operation(
        summary = "Update notification preferences", 
        description = "Update user notification settings: emailNotifications, pushNotifications, requestUpdates, assignmentUpdates"
    )
    @ApiResponse(responseCode = "200", description = "Notification preferences updated successfully")
    @ApiResponse(responseCode = "400", description = "Invalid preferences data or user not found")
    @PatchMapping("/notifications/{userId}")
    public ResponseEntity<?> updateNotificationPreferences(
            @PathVariable Long userId,
            @RequestBody Map<String, Boolean> preferences) {
        try {
            userService.updateNotificationPreferences(userId, preferences);
            return ResponseEntity.ok(Map.of("message", "Notification preferences updated"));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
    
    @Operation(
        summary = "Get user settings and profile", 
        description = "Retrieve complete user settings including profile information (name, phone, location details) and notification preferences (email, push, request updates, assignment updates)"
    )
    @ApiResponse(responseCode = "200", description = "Settings retrieved successfully",
        content = @io.swagger.v3.oas.annotations.media.Content(
            mediaType = "application/json",
            schema = @io.swagger.v3.oas.annotations.media.Schema(
                example = "{\"name\": \"John Doe\", \"phoneNumber\": \"0788123456\", \"sector\": \"Kimironko\", \"cell\": \"Bibare\", \"village\": \"Kamatamu\", \"emailNotifications\": true, \"pushNotifications\": true, \"requestUpdates\": true, \"assignmentUpdates\": true}"
            )
        )
    )
    @ApiResponse(responseCode = "400", description = "User not found")
    @GetMapping("/{userId}")
    public ResponseEntity<?> getUserSettings(@PathVariable Long userId) {
        try {
            Map<String, Object> settings = userService.getUserSettings(userId);
            return ResponseEntity.ok(settings);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
    
    @Operation(summary = "Update profile information", description = "Update user profile details (name, phoneNumber, sector, cell, village)")
    @ApiResponse(responseCode = "200", description = "Profile updated successfully")
    @PatchMapping("/profile/{userId}")
    public ResponseEntity<?> updateProfile(
            @PathVariable Long userId,
            @RequestBody Map<String, Object> profileData) {
        try {
            // Validate required fields
            if (profileData.containsKey("name")) {
                String name = (String) profileData.get("name");
                if (name == null || name.trim().isEmpty()) {
                    return ResponseEntity.badRequest().body(Map.of("error", "Name cannot be empty"));
                }
            }
            
            if (profileData.containsKey("phoneNumber")) {
                String phoneNumber = (String) profileData.get("phoneNumber");
                if (phoneNumber != null && !phoneNumber.matches("^[0-9]{10}$")) {
                    return ResponseEntity.badRequest().body(Map.of("error", "Phone number must be exactly 10 digits"));
                }
            }
            
            userService.updateProfile(userId, profileData);
            return ResponseEntity.ok(Map.of("message", "Profile updated successfully"));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}