package om.community.supportsystem.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {
    
    @Autowired
    private JavaMailSender mailSender;
    
    @Value("${spring.mail.username:darkosee23@gmail.com}")
    private String fromEmail;
    
    public void sendPasswordResetEmail(String toEmail, String resetToken) {
        try {
            System.out.println("🔄 Attempting to send password reset email to: " + toEmail);
            System.out.println("📧 Using from email: " + fromEmail);
            
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(fromEmail);
            message.setTo(toEmail);
            message.setSubject("Password Reset - Community Support System");
            
            // Use environment variable for frontend URL or fallback
            String frontendUrl = System.getenv("FRONTEND_URL");
            if (frontendUrl == null || frontendUrl.isEmpty()) {
                frontendUrl = "https://community-support-system.vercel.app";
            }
            
            message.setText("Hello,\n\n" +
                    "You requested a password reset for your Community Support System account.\n\n" +
                    "Click the link below to reset your password:\n" +
                    frontendUrl + "/reset-password?token=" + resetToken +
                    "\n\nThis link will expire in 1 hour.\n\n" +
                    "If you didn't request this reset, please ignore this email.");
            
            System.out.println("📤 Sending password reset email...");
            mailSender.send(message);
            System.out.println("✅ Password reset email sent successfully to: " + toEmail);
        } catch (Exception e) {
            System.err.println("❌ Failed to send password reset email to " + toEmail + ": " + e.getMessage());
            e.printStackTrace();
            throw new RuntimeException("Failed to send password reset email: " + e.getMessage(), e);
        }
    }
    
    public void sendEmailVerification(String toEmail, String verificationToken) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(fromEmail);
            message.setTo(toEmail);
            message.setSubject("Email Verification - Community Support System");
            
            // Use environment variable for frontend URL or fallback
            String frontendUrl = System.getenv("FRONTEND_URL");
            if (frontendUrl == null || frontendUrl.isEmpty()) {
                frontendUrl = "https://community-support-system.vercel.app";
            }
            
            message.setText("Welcome to Community Support System!\n\n" +
                    "Please click the link below to verify your email address:\n" +
                    frontendUrl + "/verify-email?token=" + verificationToken +
                    "\n\nThis link will expire in 24 hours.\n\n" +
                    "If you didn't create an account, please ignore this email.");
            
            mailSender.send(message);
            System.out.println("✅ Verification email sent successfully to: " + toEmail);
        } catch (Exception e) {
            System.err.println("❌ Failed to send verification email to " + toEmail + ": " + e.getMessage());
            e.printStackTrace();
            // Don't throw exception - allow registration to continue
            // throw new RuntimeException("Failed to send email", e);
        }
    }
    
    public void sendTwoFactorCode(String toEmail, String code) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(fromEmail);
            message.setTo(toEmail);
            message.setSubject("Two-Factor Authentication Code - Community Support System");
            message.setText("Your verification code is: " + code +
                    "\n\nThis code will expire in 5 minutes." +
                    "\n\nIf you didn't request this code, please ignore this email.");
            
            mailSender.send(message);
            System.out.println("2FA code sent to: " + toEmail);
        } catch (Exception e) {
            System.err.println("Failed to send 2FA code: " + e.getMessage());
            throw new RuntimeException("Failed to send email", e);
        }
    }
}