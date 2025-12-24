package om.community.supportsystem.controller;

import om.community.supportsystem.service.EmailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

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
    
    @PostMapping("/send-test-otp")
    public ResponseEntity<?> sendTestOTP(@RequestBody Map<String, String> request) {
        try {
            String email = request.get("email");
            if (email == null || email.isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("error", "Email is required"));
            }
            
            // Send a test OTP
            emailService.sendLoginOTP(email, "123456");
            
            return ResponseEntity.ok(Map.of(
                "message", "Test OTP sent successfully",
                "email", email,
                "otp", "123456"
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                "error", "Failed to send test OTP: " + e.getMessage()
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