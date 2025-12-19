package om.community.supportsystem.controller;

import om.community.supportsystem.service.EmailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;

import java.util.Map;

@RestController
@RequestMapping("/api/test-email")
@Tag(name = "📧 Test Email", description = "Testing endpoints for debugging email functionality")
@CrossOrigin(origins = {"http://localhost:3001", "http://localhost:5173", "https://community-support-system.vercel.app"}, allowCredentials = "true")
public class TestEmailController {
    
    @Autowired
    private EmailService emailService;
    
    @Operation(summary = "Test password reset email", description = "Send a test password reset email to verify email configuration")
    @ApiResponse(responseCode = "200", description = "Test email sent successfully")
    @PostMapping("/password-reset")
    public ResponseEntity<?> testPasswordResetEmail(@RequestBody Map<String, String> request) {
        try {
            String email = request.get("email");
            String testToken = "test-token-123";
            
            System.out.println("🧪 Testing password reset email to: " + email);
            emailService.sendPasswordResetEmail(email, testToken);
            
            return ResponseEntity.ok(Map.of(
                "message", "Test password reset email sent successfully",
                "email", email,
                "status", "success"
            ));
        } catch (Exception e) {
            System.err.println("❌ Test email failed: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.internalServerError().body(Map.of(
                "error", "Failed to send test email: " + e.getMessage(),
                "status", "failed"
            ));
        }
    }
    
    @Operation(summary = "Test email verification", description = "Send a test email verification to verify email configuration")
    @ApiResponse(responseCode = "200", description = "Test verification email sent successfully")
    @PostMapping("/verification")
    public ResponseEntity<?> testVerificationEmail(@RequestBody Map<String, String> request) {
        try {
            String email = request.get("email");
            String testToken = "test-verification-token-123";
            
            System.out.println("🧪 Testing verification email to: " + email);
            emailService.sendEmailVerification(email, testToken);
            
            return ResponseEntity.ok(Map.of(
                "message", "Test verification email sent successfully",
                "email", email,
                "status", "success"
            ));
        } catch (Exception e) {
            System.err.println("❌ Test verification email failed: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.internalServerError().body(Map.of(
                "error", "Failed to send test verification email: " + e.getMessage(),
                "status", "failed"
            ));
        }
    }
    
    @Operation(summary = "Get email configuration", description = "Get current email configuration for debugging")
    @ApiResponse(responseCode = "200", description = "Email configuration retrieved")
    @GetMapping("/config")
    public ResponseEntity<?> getEmailConfig() {
        try {
            return ResponseEntity.ok(Map.of(
                "message", "Email configuration retrieved",
                "host", "smtp.gmail.com",
                "port", 587,
                "fromEmail", "darkosee23@gmail.com",
                "status", "configured"
            ));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of(
                "error", "Failed to get email config: " + e.getMessage(),
                "status", "failed"
            ));
        }
    }
}