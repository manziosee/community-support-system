package om.community.supportsystem.controller;

import om.community.supportsystem.model.User;
import om.community.supportsystem.repository.UserRepository;
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
}
