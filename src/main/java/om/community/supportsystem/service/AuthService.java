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

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.Random;
import java.util.UUID;

@Service
public class AuthService {
    
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
        
        user = userRepository.save(user);
        
        // Send verification email - optional, don't fail registration if email fails
        try {
            emailService.sendEmailVerification(user.getEmail(), user.getEmailVerificationToken());
        } catch (Exception e) {
            System.err.println("Failed to send verification email, but registration continues: " + e.getMessage());
        }
        
        // Generate JWT token
        String token = jwtUtil.generateToken(user.getEmail(), user.getRole().name(), user.getUserId());
        
        return new AuthResponse(token, user);
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
        
        // Check if 2FA is enabled
        if (user.isTwoFactorEnabled()) {
            if (request.getTwoFactorCode() == null || request.getTwoFactorCode().isEmpty()) {
                // Generate and send 2FA code
                String code = String.format("%06d", random.nextInt(999999));
                user.setTwoFactorSecret(code); // Temporarily store code
                userRepository.save(user);
                emailService.sendTwoFactorCode(user.getEmail(), code);
                
                return new AuthResponse("Two-factor authentication required", true);
            } else {
                // Verify 2FA code
                if (!request.getTwoFactorCode().equals(user.getTwoFactorSecret())) {
                    throw new RuntimeException("Invalid two-factor code");
                }
                user.setTwoFactorSecret(null); // Clear temporary code
            }
        }
        
        userRepository.save(user);
        
        // Generate JWT token
        String token = jwtUtil.generateToken(user.getEmail(), user.getRole().name(), user.getUserId());
        
        return new AuthResponse(token, user);
    }
    
    public void requestPasswordReset(String email) {
        System.out.println("🔄 Password reset requested for email: " + email);
        
        Optional<User> userOpt = userRepository.findByEmail(email);
        if (userOpt.isEmpty()) {
            System.out.println("⚠️ Email not found in database: " + email);
            // Don't reveal if email exists
            return;
        }
        
        User user = userOpt.get();
        String resetToken = UUID.randomUUID().toString();
        user.setPasswordResetToken(resetToken);
        user.setPasswordResetTokenExpiry(LocalDateTime.now().plusHours(1));
        
        System.out.println("💾 Saving reset token for user: " + user.getUserId());
        userRepository.save(user);
        
        try {
            System.out.println("📧 Attempting to send password reset email...");
            emailService.sendPasswordResetEmail(email, resetToken);
            System.out.println("✅ Password reset process completed successfully");
        } catch (Exception e) {
            System.err.println("❌ Failed to send password reset email: " + e.getMessage());
            e.printStackTrace();
            // Still save the token so user can try again
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
    
    public void enableTwoFactor(Long userId) {
        Optional<User> userOpt = userRepository.findById(userId);
        if (userOpt.isEmpty()) {
            throw new RuntimeException("User not found");
        }
        
        User user = userOpt.get();
        user.setTwoFactorEnabled(true);
        
        userRepository.save(user);
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
        Optional<User> userOpt = userRepository.findByEmail(email);
        if (userOpt.isEmpty()) {
            // Don't reveal if email exists
            return;
        }
        
        User user = userOpt.get();
        if (user.isEmailVerified()) {
            // Email already verified
            return;
        }
        
        // Generate new verification token
        String newToken = UUID.randomUUID().toString();
        user.setEmailVerificationToken(newToken);
        userRepository.save(user);
        
        // Send verification email
        try {
            emailService.sendEmailVerification(email, newToken);
        } catch (Exception e) {
            System.err.println("Failed to resend verification email: " + e.getMessage());
        }
    }
}