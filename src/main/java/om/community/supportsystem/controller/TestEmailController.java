package om.community.supportsystem.controller;

import om.community.supportsystem.service.EmailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;

import java.util.Map;

@RestController
@RequestMapping("/api/test")
@Tag(name = "🧪 Test Email", description = "Testing endpoints for debugging email functionality")
@CrossOrigin(origins = {"http://localhost:3001", "http://localhost:5173", "https://community-support-system.vercel.app"}, allowCredentials = "true")
public class TestEmailController {
    
    @Autowired
    private EmailService emailService;
    
    @Operation(summary = "Send test email", description = "Send a test verification email to check email configuration")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Test email sent successfully"),
        @ApiResponse(responseCode = "400", description = "Email is required"),
        @ApiResponse(responseCode = "500", description = "Failed to send email")
    })
    @PostMapping("/send-test-email")
    public ResponseEntity<?> sendTestEmail(
            @io.swagger.v3.oas.annotations.parameters.RequestBody(
                description = "Email address to send test email to",
                content = @io.swagger.v3.oas.annotations.media.Content(
                    schema = @io.swagger.v3.oas.annotations.media.Schema(
                        example = "{\"email\": \"test@example.com\"}"
                    )
                )
            )
            @RequestBody Map<String, String> request) {
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