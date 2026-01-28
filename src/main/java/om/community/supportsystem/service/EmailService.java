package om.community.supportsystem.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {
    
    @Autowired(required = false)
    private JavaMailSender mailSender;
    
    @Autowired(required = false)
    private SendGridEmailService sendGridEmailService;
    
    @Value("${spring.mail.username:}")
    private String fromEmail;
    
    @Value("${sendgrid.enabled:false}")
    private boolean sendGridEnabled;
    
    public void sendPasswordResetEmail(String toEmail, String resetToken) {
        try {
            System.out.println("🔄 Attempting to send password reset email to: " + toEmail);
            
            if (sendGridEnabled && sendGridEmailService != null) {
                System.out.println("📧 Using SendGrid for email delivery");
                sendGridEmailService.sendPasswordResetEmail(toEmail, "User", resetToken);
                return;
            }
            
            // Check if SMTP is available
            if (mailSender != null && fromEmail != null && !fromEmail.isEmpty()) {
                System.out.println("📧 Using SMTP for email delivery");
                sendPasswordResetEmailSMTP(toEmail, resetToken);
                return;
            }
            
            // Email service unavailable - log token for manual use
            System.err.println("⚠️ Email service unavailable. Logging reset token for manual use:");
            System.err.println("🔑 MANUAL RESET TOKEN for " + toEmail + ": " + resetToken);
            System.err.println("🔗 MANUAL RESET URL: " + getFrontendUrl() + "/reset-password?token=" + resetToken);
            
        } catch (Exception e) {
            System.err.println("❌ Failed to send password reset email to " + toEmail + ": " + e.getMessage());
            
            // Log the reset token so it can be used manually
            System.err.println("🔑 MANUAL RESET TOKEN for " + toEmail + ": " + resetToken);
            System.err.println("🔗 MANUAL RESET URL: " + getFrontendUrl() + "/reset-password?token=" + resetToken);
            System.err.println("⚠️ Email service unavailable. Use the above URL to reset password.");
        }
    }
    
    public void sendEmailVerification(String toEmail, String verificationToken) {
        try {
            System.out.println("🔄 Attempting to send verification email to: " + toEmail);
            
            if (sendGridEnabled && sendGridEmailService != null) {
                System.out.println("📧 Using SendGrid for email delivery");
                sendGridEmailService.sendVerificationEmail(toEmail, "User", verificationToken);
                return;
            }
            
            // Check if SMTP is available
            if (mailSender != null && fromEmail != null && !fromEmail.isEmpty()) {
                System.out.println("📧 Using SMTP for email delivery");
                sendEmailVerificationSMTP(toEmail, verificationToken);
                return;
            }
            
            // Email service unavailable - log token for manual use
            System.err.println("⚠️ Email service unavailable. Logging verification token for manual use:");
            System.err.println("🔑 MANUAL VERIFICATION TOKEN for " + toEmail + ": " + verificationToken);
            System.err.println("🔗 MANUAL VERIFICATION URL: " + getFrontendUrl() + "/verify-email?token=" + verificationToken);
            
        } catch (Exception e) {
            System.err.println("❌ Failed to send verification email to " + toEmail + ": " + e.getMessage());
            // Don't throw exception - allow registration to continue
        }
    }
    
    private void sendPasswordResetEmailSMTP(String toEmail, String resetToken) {
        if (mailSender == null) {
            throw new RuntimeException("SMTP mail sender not available");
        }
        
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom(fromEmail);
        message.setTo(toEmail);
        message.setSubject("Password Reset - Community Support System");
        
        String frontendUrl = getFrontendUrl();
        
        message.setText("Hello,\n\n" +
                "You requested a password reset for your Community Support System account.\n\n" +
                "Click the link below to reset your password:\n" +
                frontendUrl + "/reset-password?token=" + resetToken +
                "\n\nThis link will expire in 1 hour.\n\n" +
                "If you didn't request this reset, please ignore this email.");
        
        mailSender.send(message);
        System.out.println("✅ Password reset email sent successfully to: " + toEmail);
    }
    
    private void sendEmailVerificationSMTP(String toEmail, String verificationToken) {
        if (mailSender == null) {
            throw new RuntimeException("SMTP mail sender not available");
        }
        
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom(fromEmail);
        message.setTo(toEmail);
        message.setSubject("Email Verification - Community Support System");
        
        String frontendUrl = getFrontendUrl();
        
        message.setText("Welcome to Community Support System!\n\n" +
                "Please click the link below to verify your email address:\n" +
                frontendUrl + "/verify-email?token=" + verificationToken +
                "\n\nThis link will expire in 24 hours.\n\n" +
                "If you didn't create an account, please ignore this email.");
        
        mailSender.send(message);
        System.out.println("✅ Verification email sent successfully to: " + toEmail);
    }
    
    private String getFrontendUrl() {
        // Check if we're running on Fly.io (production)
        String flyEnv = System.getenv("FLY_APP_NAME");
        if (flyEnv != null) {
            return "https://community-support-system.vercel.app";
        }
        
        // Check if we're running on Render (production)
        String renderEnv = System.getenv("RENDER");
        if (renderEnv != null) {
            return "https://community-support-system.vercel.app";
        }
        
        // Local development - check for custom frontend URL
        String localUrl = System.getenv("FRONTEND_URL");
        if (localUrl != null && !localUrl.isEmpty()) {
            return localUrl;
        }
        
        // Default local frontend URL (port 3001)
        return "http://localhost:3001";
    }
    
    public void sendTwoFactorCode(String toEmail, String code) {
        try {
            if (sendGridEnabled && sendGridEmailService != null) {
                String subject = "Two-Factor Authentication Code - Community Support System";
                String content = String.format(
                    "<h2>Two-Factor Authentication</h2>" +
                    "<p>Your verification code is: <strong>%s</strong></p>" +
                    "<p>This code will expire in 5 minutes.</p>" +
                    "<p>If you didn't request this code, please ignore this email.</p>",
                    code
                );
                sendGridEmailService.sendEmail(toEmail, subject, content);
                return;
            }
            
            // Check if SMTP is available
            if (mailSender != null && fromEmail != null && !fromEmail.isEmpty()) {
                SimpleMailMessage message = new SimpleMailMessage();
                message.setFrom(fromEmail);
                message.setTo(toEmail);
                message.setSubject("Two-Factor Authentication Code - Community Support System");
                message.setText("Your verification code is: " + code +
                        "\n\nThis code will expire in 5 minutes." +
                        "\n\nIf you didn't request this code, please ignore this email.");
                
                mailSender.send(message);
                System.out.println("2FA code sent to: " + toEmail);
                return;
            }
            
            // Email service unavailable
            System.err.println("⚠️ Email service unavailable. 2FA code for " + toEmail + ": " + code);
            
        } catch (Exception e) {
            System.err.println("Failed to send 2FA code: " + e.getMessage());
            System.err.println("🔑 MANUAL 2FA CODE for " + toEmail + ": " + code);
        }
    }
    
    public void sendLoginOTP(String toEmail, String code) {
        try {
            if (sendGridEnabled && sendGridEmailService != null) {
                String subject = "Login Verification Code - Community Support System";
                String content = String.format(
                    "<div style='font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;'>" +
                    "<h2 style='color: #2c5aa0;'>Login Verification</h2>" +
                    "<p>Hello,</p>" +
                    "<p>Someone is trying to log in to your Community Support System account. Please use the verification code below to complete your login:</p>" +
                    "<div style='background-color: #f8f9fa; padding: 20px; border-radius: 8px; text-align: center; margin: 20px 0;'>" +
                    "<h1 style='color: #2c5aa0; font-size: 32px; margin: 0; letter-spacing: 4px;'>%s</h1>" +
                    "</div>" +
                    "<p><strong>This code will expire in 5 minutes.</strong></p>" +
                    "<p>If you didn't attempt to log in, please ignore this email and consider changing your password.</p>" +
                    "<hr style='border: none; border-top: 1px solid #eee; margin: 30px 0;'>" +
                    "<p style='color: #666; font-size: 12px;'>© 2025 Community Support System. This is an automated message.</p>" +
                    "</div>",
                    code
                );
                sendGridEmailService.sendEmail(toEmail, subject, content);
                return;
            }
            
            // Check if SMTP is available
            if (mailSender != null && fromEmail != null && !fromEmail.isEmpty()) {
                SimpleMailMessage message = new SimpleMailMessage();
                message.setFrom(fromEmail);
                message.setTo(toEmail);
                message.setSubject("Login Verification Code - Community Support System");
                message.setText("Your login verification code is: " + code +
                        "\n\nThis code will expire in 5 minutes." +
                        "\n\nIf you didn't attempt to log in, please ignore this email.");
                
                mailSender.send(message);
                System.out.println("Login OTP sent to: " + toEmail);
                return;
            }
            
            // Email service unavailable
            System.err.println("⚠️ Email service unavailable. Login OTP for " + toEmail + ": " + code);
            
        } catch (Exception e) {
            System.err.println("Failed to send login OTP: " + e.getMessage());
            System.err.println("🔑 MANUAL LOGIN OTP for " + toEmail + ": " + code);
        }
    }
}