package om.community.supportsystem.controller;

import om.community.supportsystem.service.EmailService;
import om.community.supportsystem.model.User;
import om.community.supportsystem.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Optional;
import java.util.UUID;

@RestController
@RequestMapping("/api/test")
@CrossOrigin(origins = {
    "http://localhost:3000",
    "http://localhost:3001", 
    "http://localhost:5173",
    "https://community-support-system.vercel.app"
}, allowCredentials = "true")
public class TestController {
    
    @Autowired
    private EmailService emailService;
    
    @Autowired
    private UserRepository userRepository;
    
    @PostMapping("/send-test-email")
    public ResponseEntity<?> sendTestEmail(@RequestBody Map<String, String> request) {
        try {
            String email = request.get("email");
            if (email == null || email.isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("error", "Email is required"));
            }
            
            // Send a test verification email
            emailService.sendEmailVerification(email, "test-token-123");
            
            return ResponseEntity.ok(Map.of(
                "message", "Test email sent successfully",
                "email", email
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                "error", "Failed to send test email: " + e.getMessage()
            ));
        }
    }
    
    @PostMapping("/send-verification-email")
    public ResponseEntity<?> sendVerificationEmail(@RequestBody Map<String, String> request) {
        try {
            String email = request.get("email");
            if (email == null || email.isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("error", "Email is required"));
            }
            
            // Find user by email
            Optional<User> userOpt = userRepository.findByEmail(email);
            if (userOpt.isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("error", "User not found"));
            }
            
            User user = userOpt.get();
            if (user.isEmailVerified()) {
                return ResponseEntity.badRequest().body(Map.of("error", "Email is already verified"));
            }
            
            // Generate new verification token
            String newToken = UUID.randomUUID().toString();
            user.setEmailVerificationToken(newToken);
            userRepository.save(user);
            
            // Send verification email
            emailService.sendEmailVerification(email, newToken);
            
            return ResponseEntity.ok(Map.of(
                "message", "Verification email sent successfully",
                "email", email,
                "token", newToken // For testing purposes
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                "error", "Failed to send verification email: " + e.getMessage()
            ));
        }
    }
    
    @GetMapping("/environment")
    public ResponseEntity<?> getEnvironmentInfo() {
        String renderEnv = System.getenv("RENDER");
        String frontendUrl = System.getenv("FRONTEND_URL");
        String sendGridKey = System.getenv("SENDGRID_API_KEY");
        
        return ResponseEntity.ok(Map.of(
            "isProduction", renderEnv != null,
            "frontendUrl", frontendUrl != null ? frontendUrl : "Not set",
            "hasSendGridKey", sendGridKey != null && !sendGridKey.isEmpty(),
            "environment", renderEnv != null ? "production" : "development"
        ));
    }
}