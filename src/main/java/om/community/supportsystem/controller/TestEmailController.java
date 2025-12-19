package om.community.supportsystem.controller;

import om.community.supportsystem.service.EmailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/test")
@CrossOrigin(origins = {"http://localhost:3001", "http://localhost:5173", "https://community-support-system.vercel.app"}, allowCredentials = "true")
public class TestEmailController {
    
    @Autowired
    private EmailService emailService;
    
    @PostMapping("/send-test-email")
    public ResponseEntity<?> sendTestEmail(@RequestBody Map<String, String> request) {
        try {
            String email = request.get("email");
            if (email == null || email.isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("error", "Email is required"));
            }
            
            emailService.sendEmailVerification(email, "test-token-123");
            return ResponseEntity.ok(Map.of("message", "Test email sent successfully"));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of("error", "Failed to send email: " + e.getMessage()));
        }
    }
}