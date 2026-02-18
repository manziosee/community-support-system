package om.community.supportsystem.controller;

import om.community.supportsystem.model.User;
import om.community.supportsystem.repository.UserRepository;
import om.community.supportsystem.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.responses.ApiResponse;

import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@Tag(name = "🔑 Admin", description = "Administrative endpoints for user management")
public class AdminUserController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private UserService userService;

    @Operation(summary = "Verify User Email", description = "Manually verify a user's email address and unlock their account")
    @ApiResponse(responseCode = "200", description = "User verified successfully")
    @PatchMapping("/users/{userId}/verify")
    public ResponseEntity<?> verifyUser(@PathVariable Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        user.setEmailVerified(true);
        user.setAccountLocked(false);
        user.setFailedLoginAttempts(0);
        user.setEmailVerificationToken(null);
        
        userRepository.save(user);
        
        return ResponseEntity.ok(Map.of(
            "message", "User verified successfully",
            "userId", userId,
            "email", user.getEmail()
        ));
    }

    @Operation(summary = "Unlock User Account", description = "Unlock a user account that was locked due to failed login attempts")
    @ApiResponse(responseCode = "200", description = "User unlocked successfully")
    @PatchMapping("/users/{userId}/unlock")
    public ResponseEntity<?> unlockUser(@PathVariable Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        user.setAccountLocked(false);
        user.setFailedLoginAttempts(0);

        userRepository.save(user);

        return ResponseEntity.ok(Map.of(
            "message", "User unlocked successfully",
            "userId", userId,
            "email", user.getEmail()
        ));
    }

    @Operation(summary = "Lock User Account", description = "Lock a user account to prevent login")
    @ApiResponse(responseCode = "200", description = "User locked successfully")
    @PatchMapping("/users/{userId}/lock")
    public ResponseEntity<?> lockUser(@PathVariable Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        user.setAccountLocked(true);

        userRepository.save(user);

        return ResponseEntity.ok(Map.of(
            "message", "User account locked successfully",
            "userId", userId,
            "email", user.getEmail()
        ));
    }

    @Operation(summary = "Admin Reset Password", description = "Reset a user's password (admin only)")
    @ApiResponse(responseCode = "200", description = "Password reset successfully")
    @PatchMapping("/users/{userId}/reset-password")
    public ResponseEntity<?> resetUserPassword(@PathVariable Long userId, @RequestBody Map<String, String> request) {
        String newPassword = request.get("newPassword");
        if (newPassword == null || newPassword.length() < 8) {
            return ResponseEntity.badRequest().body(Map.of(
                "message", "Password must be at least 8 characters"
            ));
        }

        userService.adminResetPassword(userId, newPassword);

        return ResponseEntity.ok(Map.of(
            "message", "Password reset successfully",
            "userId", userId
        ));
    }
}
