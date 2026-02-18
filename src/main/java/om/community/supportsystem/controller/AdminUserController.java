package om.community.supportsystem.controller;

import om.community.supportsystem.model.User;
import om.community.supportsystem.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/admin")
public class AdminUserController {

    @Autowired
    private UserRepository userRepository;

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
