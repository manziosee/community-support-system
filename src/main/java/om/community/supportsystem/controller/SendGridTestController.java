package om.community.supportsystem.controller;

import om.community.supportsystem.service.SendGridEmailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/test")
@ConditionalOnProperty(name = "sendgrid.enabled", havingValue = "true")
public class SendGridTestController {

    @Autowired
    private SendGridEmailService sendGridEmailService;

    @PostMapping("/send-email")
    public ResponseEntity<?> testSendEmail(@RequestBody Map<String, String> request) {
        try {
            String toEmail = request.get("email");
            String subject = request.getOrDefault("subject", "Test Email from Community Support System");
            String content = request.getOrDefault("content", 
                "<h2>Test Email</h2><p>This is a test email from Community Support System using SendGrid!</p>");

            sendGridEmailService.sendEmail(toEmail, subject, content);
            
            return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "Email sent successfully to " + toEmail
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                "success", false,
                "error", e.getMessage()
            ));
        }
    }

    @PostMapping("/send-verification")
    public ResponseEntity<?> testVerificationEmail(@RequestBody Map<String, String> request) {
        try {
            String toEmail = request.get("email");
            String userName = request.getOrDefault("name", "Test User");
            String token = "test-verification-token-123";

            sendGridEmailService.sendVerificationEmail(toEmail, userName, token);
            
            return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "Verification email sent successfully to " + toEmail
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                "success", false,
                "error", e.getMessage()
            ));
        }
    }

    @PostMapping("/send-password-reset")
    public ResponseEntity<?> testPasswordResetEmail(@RequestBody Map<String, String> request) {
        try {
            String toEmail = request.get("email");
            String userName = request.getOrDefault("name", "Test User");
            String token = "test-reset-token-456";

            sendGridEmailService.sendPasswordResetEmail(toEmail, userName, token);
            
            return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "Password reset email sent successfully to " + toEmail
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                "success", false,
                "error", e.getMessage()
            ));
        }
    }
}