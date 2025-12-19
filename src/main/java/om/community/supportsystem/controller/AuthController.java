package om.community.supportsystem.controller;

import om.community.supportsystem.dto.AuthResponse;
import om.community.supportsystem.dto.LoginRequest;
import om.community.supportsystem.dto.RegisterRequest;
import om.community.supportsystem.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;

import jakarta.validation.Valid;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;
import om.community.supportsystem.model.User;
import om.community.supportsystem.repository.UserRepository;

@RestController
@RequestMapping("/api/auth")
@Tag(name = "🔐 Authentication", description = "User authentication, registration, password reset, and 2FA management")
public class AuthController {
    
    @Autowired
    private AuthService authService;
    
    @Operation(summary = "User Registration", description = "Register a new user account with email verification")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Registration successful"),
        @ApiResponse(responseCode = "400", description = "Invalid registration data")
    })
    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody RegisterRequest request) {
        try {
            AuthResponse response = authService.register(request);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
    
    @Operation(summary = "User Login", description = "Authenticate user with email/password and optional 2FA")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Login successful"),
        @ApiResponse(responseCode = "400", description = "Invalid credentials or 2FA required")
    })
    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequest request) {
        try {
            AuthResponse response = authService.login(request);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
    
    @Operation(summary = "Request Password Reset", description = "Send password reset email to user")
    @ApiResponse(responseCode = "200", description = "Password reset email sent")
    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(@RequestBody Map<String, String> request) {
        try {
            String email = request.get("email");
            authService.requestPasswordReset(email);
            return ResponseEntity.ok(Map.of("message", "Password reset email sent"));
        } catch (Exception e) {
            return ResponseEntity.ok(Map.of("message", "If the email exists, a reset link has been sent"));
        }
    }
    
    @Operation(summary = "Reset Password", description = "Reset password using reset token")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Password reset successful"),
        @ApiResponse(responseCode = "400", description = "Invalid or expired token")
    })
    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@RequestBody Map<String, String> request) {
        try {
            String token = request.get("token");
            String newPassword = request.get("password");
            authService.resetPassword(token, newPassword);
            return ResponseEntity.ok(Map.of("message", "Password reset successful"));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
    
    @Operation(summary = "Verify Email", description = "Verify user email using verification token")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Email verified successfully"),
        @ApiResponse(responseCode = "400", description = "Invalid verification token")
    })
    @PostMapping("/verify-email")
    public ResponseEntity<?> verifyEmail(@RequestBody Map<String, String> request) {
        try {
            String token = request.get("token");
            authService.verifyEmail(token);
            return ResponseEntity.ok(Map.of("message", "Email verified successfully"));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
    
    @Operation(summary = "Resend Email Verification", description = "Resend verification email to user")
    @ApiResponse(responseCode = "200", description = "Verification email sent")
    @PostMapping("/resend-verification")
    public ResponseEntity<?> resendVerification(@RequestBody Map<String, String> request) {
        try {
            String email = request.get("email");
            authService.resendEmailVerification(email);
            return ResponseEntity.ok(Map.of("message", "Verification email sent"));
        } catch (Exception e) {
            // Don't reveal if email exists
            return ResponseEntity.ok(Map.of("message", "If the email exists and is unverified, a verification email has been sent"));
        }
    }
    
    @Operation(summary = "Enable Two-Factor Authentication", description = "Enable 2FA for user account")
    @ApiResponse(responseCode = "200", description = "2FA enabled successfully")
    @PostMapping("/enable-2fa/{userId}")
    public ResponseEntity<?> enableTwoFactor(
            @Parameter(description = "User ID", required = true)
            @PathVariable Long userId) {
        try {
            authService.enableTwoFactor(userId);
            return ResponseEntity.ok(Map.of("message", "Two-factor authentication enabled"));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
    
    @Operation(summary = "Disable Two-Factor Authentication", description = "Disable 2FA for user account")
    @ApiResponse(responseCode = "200", description = "2FA disabled successfully")
    @PostMapping("/disable-2fa/{userId}")
    public ResponseEntity<?> disableTwoFactor(
            @Parameter(description = "User ID", required = true)
            @PathVariable Long userId) {
        try {
            authService.disableTwoFactor(userId);
            return ResponseEntity.ok(Map.of("message", "Two-factor authentication disabled"));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}