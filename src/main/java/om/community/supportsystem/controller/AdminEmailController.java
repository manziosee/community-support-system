package om.community.supportsystem.controller;

import om.community.supportsystem.model.User;
import om.community.supportsystem.repository.UserRepository;
import om.community.supportsystem.service.EmailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;

import java.util.Map;
import java.util.Optional;
import java.util.UUID;

@RestController
@RequestMapping("/api/admin")
@Tag(name = "🔧 Admin Email", description = "Admin email verification management - Force send verification emails and manually verify users")
@CrossOrigin(origins = {"http://localhost:3001", "http://localhost:5173", "https://community-support-system.vercel.app"}, allowCredentials = "true")
public class AdminEmailController {
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private EmailService emailService;
    
    @Operation(summary = "Force send verification email", description = "Admin endpoint to force send verification email to any user")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Verification email sent successfully"),
        @ApiResponse(responseCode = "400", description = "User not found or invalid email"),
        @ApiResponse(responseCode = "500", description = "Failed to send email")
    })
    @PostMapping("/force-verify-email")
    public ResponseEntity<?> forceVerifyEmail(
            @io.swagger.v3.oas.annotations.parameters.RequestBody(
                description = "Email address to send verification to",
                content = @io.swagger.v3.oas.annotations.media.Content(
                    schema = @io.swagger.v3.oas.annotations.media.Schema(
                        example = "{\"email\": \"user@example.com\"}"
                    )
                )
            )
            @RequestBody Map<String, String> request) {
        try {
            String email = request.get("email");
            if (email == null || email.isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("error", "Email is required"));
            }
            
            Optional<User> userOpt = userRepository.findByEmail(email);
            if (userOpt.isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("error", "User not found"));
            }
            
            User user = userOpt.get();
            
            // Generate new verification token
            String newToken = UUID.randomUUID().toString();
            user.setEmailVerificationToken(newToken);
            userRepository.save(user);
            
            // Send verification email
            emailService.sendEmailVerification(email, newToken);
            
            return ResponseEntity.ok(Map.of(
                "message", "Verification email sent to " + email,
                "userId", user.getUserId(),
                "currentlyVerified", user.isEmailVerified()
            ));
            
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of("error", "Failed to send verification email: " + e.getMessage()));
        }
    }
    
    @Operation(summary = "Manually verify user email", description = "Admin endpoint to manually mark a user's email as verified")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Email verified successfully"),
        @ApiResponse(responseCode = "400", description = "User not found or invalid email"),
        @ApiResponse(responseCode = "500", description = "Failed to verify email")
    })
    @PostMapping("/manually-verify-email")
    public ResponseEntity<?> manuallyVerifyEmail(
            @io.swagger.v3.oas.annotations.parameters.RequestBody(
                description = "Email address to manually verify",
                content = @io.swagger.v3.oas.annotations.media.Content(
                    schema = @io.swagger.v3.oas.annotations.media.Schema(
                        example = "{\"email\": \"user@example.com\"}"
                    )
                )
            )
            @RequestBody Map<String, String> request) {
        try {
            String email = request.get("email");
            if (email == null || email.isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("error", "Email is required"));
            }
            
            Optional<User> userOpt = userRepository.findByEmail(email);
            if (userOpt.isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("error", "User not found"));
            }
            
            User user = userOpt.get();
            user.setEmailVerified(true);
            user.setEmailVerificationToken(null);
            userRepository.save(user);
            
            return ResponseEntity.ok(Map.of(
                "message", "Email manually verified for " + email,
                "userId", user.getUserId(),
                "verified", true
            ));
            
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of("error", "Failed to verify email: " + e.getMessage()));
        }
    }
}