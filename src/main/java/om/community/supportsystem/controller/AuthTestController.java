package om.community.supportsystem.controller;

import om.community.supportsystem.service.AuthService;
import om.community.supportsystem.service.UserService;
import om.community.supportsystem.model.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/test/auth")
public class AuthTestController {

    @Autowired
    private AuthService authService;
    
    @Autowired
    private UserService userService;

    @PostMapping("/test-password-reset")
    public ResponseEntity<?> testPasswordReset(@RequestBody Map<String, String> request) {
        try {
            String email = request.get("email");
            
            // Check if user exists first
            if (!userService.existsByEmail(email)) {
                return ResponseEntity.badRequest().body(Map.of(
                    "success", false,
                    "error", "Email not found in database. Please register first."
                ));
            }
            
            authService.requestPasswordReset(email);
            
            return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "Password reset email sent successfully to " + email,
                "note", "Check your email for reset instructions"
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                "success", false,
                "error", e.getMessage()
            ));
        }
    }

    @PostMapping("/test-email-verification")
    public ResponseEntity<?> testEmailVerification(@RequestBody Map<String, String> request) {
        try {
            String email = request.get("email");
            
            // Check if user exists first
            if (!userService.existsByEmail(email)) {
                return ResponseEntity.badRequest().body(Map.of(
                    "success", false,
                    "error", "Email not found in database. Please register first."
                ));
            }
            
            authService.resendEmailVerification(email);
            
            return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "Verification email sent successfully to " + email,
                "note", "Check your email for verification instructions"
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                "success", false,
                "error", e.getMessage()
            ));
        }
    }

    @PostMapping("/test-2fa-enable/{userId}")
    public ResponseEntity<?> testEnable2FA(@PathVariable Long userId) {
        try {
            Optional<User> userOpt = userService.getUserById(userId);
            if (userOpt.isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of(
                    "success", false,
                    "error", "User not found with ID: " + userId
                ));
            }
            
            String[] backupCodes = authService.enableTwoFactor(userId);
            
            return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "2FA enabled successfully for user: " + userOpt.get().getEmail(),
                "backupCodes", backupCodes,
                "warning", "Save these backup codes securely. You'll need them if you lose access to your email."
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                "success", false,
                "error", e.getMessage()
            ));
        }
    }

    @PostMapping("/test-2fa-disable/{userId}")
    public ResponseEntity<?> testDisable2FA(@PathVariable Long userId) {
        try {
            Optional<User> userOpt = userService.getUserById(userId);
            if (userOpt.isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of(
                    "success", false,
                    "error", "User not found with ID: " + userId
                ));
            }
            
            authService.disableTwoFactor(userId);
            
            return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "2FA disabled successfully for user: " + userOpt.get().getEmail()
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                "success", false,
                "error", e.getMessage()
            ));
        }
    }

    @GetMapping("/check-user/{email}")
    public ResponseEntity<?> checkUserExists(@PathVariable String email) {
        try {
            boolean exists = userService.existsByEmail(email);
            Optional<User> userOpt = userService.getUserByEmail(email);
            
            if (exists && userOpt.isPresent()) {
                User user = userOpt.get();
                return ResponseEntity.ok(Map.of(
                    "exists", true,
                    "userId", user.getUserId(),
                    "name", user.getName(),
                    "email", user.getEmail(),
                    "emailVerified", user.isEmailVerified(),
                    "twoFactorEnabled", user.isTwoFactorEnabled(),
                    "accountLocked", user.isAccountLocked(),
                    "role", user.getRole().name()
                ));
            } else {
                return ResponseEntity.ok(Map.of(
                    "exists", false,
                    "message", "User not found in database"
                ));
            }
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                "error", e.getMessage()
            ));
        }
    }

    @GetMapping("/users/all")
    public ResponseEntity<?> getAllUsers() {
        try {
            var users = userService.getAllUsers();
            return ResponseEntity.ok(Map.of(
                "success", true,
                "count", users.size(),
                "users", users.stream().map(user -> Map.of(
                    "userId", user.getUserId(),
                    "name", user.getName(),
                    "email", user.getEmail(),
                    "role", user.getRole().name(),
                    "emailVerified", user.isEmailVerified(),
                    "twoFactorEnabled", user.isTwoFactorEnabled(),
                    "accountLocked", user.isAccountLocked()
                )).toList()
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                "success", false,
                "error", e.getMessage()
            ));
        }
    }
}