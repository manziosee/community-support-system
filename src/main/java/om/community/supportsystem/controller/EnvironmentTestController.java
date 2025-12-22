package om.community.supportsystem.controller;

import om.community.supportsystem.service.SendGridEmailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/test/environment")
public class EnvironmentTestController {

    @Autowired
    private SendGridEmailService sendGridEmailService;
    
    @Value("${frontend.url:http://localhost:3000}")
    private String frontendUrl;

    @GetMapping("/info")
    public ResponseEntity<?> getEnvironmentInfo() {
        String environment = System.getenv("RENDER") != null ? "Production (Render)" : "Development (Local)";
        String frontendUrlEnv = System.getenv("FRONTEND_URL");
        
        return ResponseEntity.ok(Map.of(
            "environment", environment,
            "configuredFrontendUrl", frontendUrl,
            "envFrontendUrl", frontendUrlEnv != null ? frontendUrlEnv : "Not set",
            "isProduction", System.getenv("RENDER") != null,
            "recommendedUrls", Map.of(
                "local", "http://localhost:3001",
                "production", "https://community-support-system.vercel.app"
            )
        ));
    }

    @PostMapping("/test-password-reset-url")
    public ResponseEntity<?> testPasswordResetUrl(@RequestBody Map<String, String> request) {
        try {
            String email = request.get("email");
            String testToken = "test-token-123";
            
            // This will use the dynamic URL detection
            sendGridEmailService.sendPasswordResetEmail(email, "Test User", testToken);
            
            return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "Password reset email sent with dynamic URL",
                "environment", System.getenv("RENDER") != null ? "Production" : "Development",
                "frontendUrl", frontendUrl
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                "success", false,
                "error", e.getMessage()
            ));
        }
    }

    @PostMapping("/test-verification-url")
    public ResponseEntity<?> testVerificationUrl(@RequestBody Map<String, String> request) {
        try {
            String email = request.get("email");
            String testToken = "test-verification-token-456";
            
            // This will use the dynamic URL detection
            sendGridEmailService.sendVerificationEmail(email, "Test User", testToken);
            
            return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "Verification email sent with dynamic URL",
                "environment", System.getenv("RENDER") != null ? "Production" : "Development",
                "frontendUrl", frontendUrl
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                "success", false,
                "error", e.getMessage()
            ));
        }
    }
}