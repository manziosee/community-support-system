package om.community.supportsystem.service;

import om.community.supportsystem.dto.AuthResponse;
import om.community.supportsystem.dto.LoginRequest;
import om.community.supportsystem.dto.RegisterRequest;
import om.community.supportsystem.model.Location;
import om.community.supportsystem.model.User;
import om.community.supportsystem.repository.UserRepository;
import om.community.supportsystem.util.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.Random;
import java.util.UUID;

@Service
public class AuthService {
    private static final Logger log = LoggerFactory.getLogger(AuthService.class);

    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private LocationService locationService;
    
    @Autowired
    private EmailService emailService;
    
    @Autowired
    private PasswordEncoder passwordEncoder;
    
    @Autowired
    private JwtUtil jwtUtil;
    
    @Autowired
    private SkillService skillService;
    
    private final Random random = new Random();
    
    public AuthResponse register(RegisterRequest request) {
        // Check if user already exists
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already registered");
        }
        
        if (userRepository.existsByPhoneNumber(request.getPhoneNumber())) {
            throw new RuntimeException("Phone number already registered");
        }
        
        // Create new user
        User user = new User();
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPhoneNumber(request.getPhoneNumber());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole(request.getRole());
        user.setProvince(request.getProvince());
        user.setDistrict(request.getDistrict());
        user.setSector(request.getSector());
        user.setCell(request.getCell());
        user.setVillage(request.getVillage());
        
        // Set skills if provided (for volunteers)
        if (request.getSkills() != null && !request.getSkills().isEmpty()) {
            java.util.Set<om.community.supportsystem.model.Skill> userSkills = new java.util.HashSet<>();
            for (RegisterRequest.SkillRequest skillRequest : request.getSkills()) {
                Optional<om.community.supportsystem.model.Skill> skill = skillService.getSkillById(skillRequest.getSkillId());
                skill.ifPresent(userSkills::add);
            }
            user.setSkills(userSkills);
        }
        
        // Generate email verification token
        user.setEmailVerificationToken(UUID.randomUUID().toString());
        user.setEmailVerified(false); // Ensure email is not verified initially
        
        user = userRepository.save(user);
        
        // Send verification email - this is critical, don't continue if it fails
        try {
            log.info("🔄 Sending verification email to: " + user.getEmail());
            emailService.sendEmailVerification(user.getEmail(), user.getEmailVerificationToken());
            log.info("✅ Verification email sent successfully");
        } catch (Exception e) {
            log.error(String.valueOf("❌ Failed to send verification email: " + e.getMessage()));
            log.error("Unexpected error", e);
            // Don't fail registration, but log the issue
        }
        
        // Don't generate JWT token - user needs to verify email first
        return new AuthResponse("Registration successful. Please check your email to verify your account.", false);
    }
    
    public AuthResponse login(LoginRequest request) {
        Optional<User> userOpt = userRepository.findByEmail(request.getEmail());
        if (userOpt.isEmpty()) {
            throw new RuntimeException("Invalid credentials");
        }
        
        User user = userOpt.get();
        
        // Check if account is locked
        if (user.isAccountLocked()) {
            throw new RuntimeException("Account is locked. Please contact support.");
        }
        
        // Verify password
        if (!user.verifyPassword(request.getPassword(), passwordEncoder)) {
            // Increment failed attempts
            user.setFailedLoginAttempts(user.getFailedLoginAttempts() + 1);
            if (user.getFailedLoginAttempts() >= 5) {
                user.setAccountLocked(true);
            }
            userRepository.save(user);
            throw new RuntimeException("Invalid credentials");
        }
        
        // Reset failed attempts on successful password verification
        user.setFailedLoginAttempts(0);
        user.setLastLoginAt(LocalDateTime.now());
        
        // Always require OTP for login (regardless of email verification status)
        if (request.getTwoFactorCode() == null || request.getTwoFactorCode().isEmpty()) {
            // Generate and send OTP code
            String code = String.format("%06d", random.nextInt(999999));
            user.setTwoFactorSecret(code);
            user.setPasswordResetTokenExpiry(LocalDateTime.now().plusMinutes(5)); // OTP expires in 5 minutes
            userRepository.save(user);
            
            try {
                log.info("🔄 Sending login OTP to: " + user.getEmail());
                emailService.sendLoginOTP(user.getEmail(), code);
                log.info("✅ Login OTP sent successfully to: " + user.getEmail());
            } catch (Exception e) {
                log.error(String.valueOf("❌ Failed to send login OTP: " + e.getMessage()));
            log.error("Unexpected error", e);
                throw new RuntimeException("Failed to send verification code. Please try again.");
            }
            
            return new AuthResponse("OTP verification required", true);
        } else {
            // Verify OTP code
            if (user.getTwoFactorSecret() == null || !request.getTwoFactorCode().equals(user.getTwoFactorSecret())) {
                throw new RuntimeException("Invalid or expired OTP code");
            }
            
            // Check if OTP code has expired (5 minutes)
            if (user.getPasswordResetTokenExpiry() != null && 
                user.getPasswordResetTokenExpiry().isBefore(LocalDateTime.now())) {
                user.setTwoFactorSecret(null);
                user.setPasswordResetTokenExpiry(null);
                userRepository.save(user);
                throw new RuntimeException("OTP code has expired. Please request a new one.");
            }
            
            // If email is not verified, verify it now (since they have access to email for OTP)
            if (!user.isEmailVerified()) {
                user.setEmailVerified(true);
                user.setEmailVerificationToken(null);
                log.info("✅ Email automatically verified for user: " + user.getEmail());
            }
            
            user.setTwoFactorSecret(null); // Clear OTP code
            user.setPasswordResetTokenExpiry(null); // Clear expiry
        }
        
        // Issue refresh token
        String refreshToken = jwtUtil.generateRefreshToken();
        user.setRefreshToken(refreshToken);
        userRepository.save(user);

        // Generate JWT access token
        String token = jwtUtil.generateToken(user.getEmail(), user.getRole().name(), user.getUserId());

        AuthResponse response = new AuthResponse(token, user);
        response.setRefreshToken(refreshToken);
        return response;
    }

    public AuthResponse refresh(String refreshToken) {
        User user = userRepository.findByRefreshToken(refreshToken)
            .orElseThrow(() -> new RuntimeException("Invalid or expired refresh token"));

        // Rotate: issue a new refresh token every time
        String newRefreshToken = jwtUtil.generateRefreshToken();
        user.setRefreshToken(newRefreshToken);
        userRepository.save(user);

        String newAccessToken = jwtUtil.generateToken(user.getEmail(), user.getRole().name(), user.getUserId());
        AuthResponse response = new AuthResponse(newAccessToken, user);
        response.setRefreshToken(newRefreshToken);
        return response;
    }

    public void revokeRefreshToken(Long userId) {
        userRepository.findById(userId).ifPresent(user -> {
            user.setRefreshToken(null);
            userRepository.save(user);
        });
    }

    public void requestPasswordReset(String email) {
        log.info("🔄 Password reset requested for email: " + email);
        
        // Check if user exists in database
        Optional<User> userOpt = userRepository.findByEmail(email);
        if (userOpt.isEmpty()) {
            log.info("⚠️ Email not found in database: " + email);
            throw new RuntimeException("Email address not found. Please check your email or register first.");
        }
        
        User user = userOpt.get();
        log.info("✅ User found: " + user.getUserId() + " - " + user.getName());
        
        // Check if account is locked
        if (user.isAccountLocked()) {
            log.info("⚠️ Account is locked for user: " + email);
            throw new RuntimeException("Account is locked. Please contact support.");
        }
        
        String resetToken = UUID.randomUUID().toString();
        user.setPasswordResetToken(resetToken);
        user.setPasswordResetTokenExpiry(LocalDateTime.now().plusHours(1));
        
        log.info("💾 Saving reset token for user: " + user.getUserId());
        log.info("🔑 Reset token: " + resetToken);
        userRepository.save(user);
        log.info("✅ Reset token saved successfully");
        
        try {
            log.info("📧 Attempting to send password reset email to: " + email);
            log.info("📧 EmailService instance: " + (emailService != null ? "Available" : "NULL"));
            emailService.sendPasswordResetEmail(email, resetToken);
            log.info("✅ Password reset email sent successfully");
        } catch (Exception e) {
            log.error(String.valueOf("❌ Failed to send password reset email: " + e.getMessage()));
            log.error("Unexpected error", e);
            log.error(String.valueOf("🔗 Reset URL: https://community-support-system.vercel.app/reset-password?token=" + resetToken));
            // Token is saved in DB, so even if email fails, manual reset is possible via logs
            throw new RuntimeException("Failed to send password reset email. Please try again later.");
        }
    }
    
    public void resetPassword(String token, String newPassword) {
        Optional<User> userOpt = userRepository.findByPasswordResetToken(token);
        if (userOpt.isEmpty()) {
            throw new RuntimeException("Invalid reset token");
        }
        
        User user = userOpt.get();
        if (user.getPasswordResetTokenExpiry().isBefore(LocalDateTime.now())) {
            throw new RuntimeException("Reset token has expired");
        }
        
        user.setPassword(passwordEncoder.encode(newPassword));
        user.setPasswordResetToken(null);
        user.setPasswordResetTokenExpiry(null);
        user.setAccountLocked(false);
        user.setFailedLoginAttempts(0);
        
        userRepository.save(user);
    }
    
    public void verifyEmail(String token) {
        Optional<User> userOpt = userRepository.findByEmailVerificationToken(token);
        if (userOpt.isEmpty()) {
            throw new RuntimeException("Invalid verification token");
        }
        
        User user = userOpt.get();
        user.setEmailVerified(true);
        user.setEmailVerificationToken(null);
        
        userRepository.save(user);
    }
    
    public String[] enableTwoFactor(Long userId) {
        Optional<User> userOpt = userRepository.findById(userId);
        if (userOpt.isEmpty()) {
            throw new RuntimeException("User not found");
        }
        
        User user = userOpt.get();
        user.setTwoFactorEnabled(true);
        
        // Generate backup codes
        String[] backupCodes = generateBackupCodes();
        user.setTwoFactorBackupCodes(String.join(",", backupCodes));
        
        userRepository.save(user);
        
        log.info("✅ 2FA enabled for user: " + user.getEmail());
        return backupCodes;
    }
    
    private String[] generateBackupCodes() {
        String[] codes = new String[8];
        for (int i = 0; i < 8; i++) {
            codes[i] = String.format("%08d", random.nextInt(99999999));
        }
        return codes;
    }
    
    public void disableTwoFactor(Long userId) {
        Optional<User> userOpt = userRepository.findById(userId);
        if (userOpt.isEmpty()) {
            throw new RuntimeException("User not found");
        }
        
        User user = userOpt.get();
        user.setTwoFactorEnabled(false);
        user.setTwoFactorSecret(null);
        
        userRepository.save(user);
    }
    
    public void resendEmailVerification(String email) {
        // Check if user exists in database
        Optional<User> userOpt = userRepository.findByEmail(email);
        if (userOpt.isEmpty()) {
            throw new RuntimeException("Email address not found. Please check your email or register first.");
        }
        
        User user = userOpt.get();
        if (user.isEmailVerified()) {
            throw new RuntimeException("Email is already verified.");
        }
        
        // Generate new verification token
        String newToken = UUID.randomUUID().toString();
        user.setEmailVerificationToken(newToken);
        userRepository.save(user);
        
        // Send verification email
        try {
            emailService.sendEmailVerification(email, newToken);
            log.info("✅ Verification email resent to: " + email);
        } catch (Exception e) {
            log.error(String.valueOf("❌ Failed to resend verification email: " + e.getMessage()));
            throw new RuntimeException("Failed to send verification email. Please try again later.");
        }
    }
}