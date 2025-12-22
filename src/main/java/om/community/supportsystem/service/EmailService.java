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
    
    @Autowired
    private SendGridEmailService sendGridEmailService;
    
    @Value("${spring.mail.username:manziosee3@gmail.com}")
    private String fromEmail;
    
    @Value("${sendgrid.enabled:true}")
    private boolean sendGridEnabled;
    
    public void sendPasswordResetEmail(String toEmail, String resetToken) {
        try {
            System.out.println("🔄 Attempting to send password reset email to: " + toEmail);
            
            if (sendGridEnabled) {
                System.out.println("📧 Using SendGrid for email delivery");
                sendGridEmailService.sendPasswordResetEmail(toEmail, "User", resetToken);
                return;
            }
            
            // Fallback to SMTP
            System.out.println("📧 Using SMTP for email delivery");
            sendPasswordResetEmailSMTP(toEmail, resetToken);
            
        } catch (Exception e) {
            System.err.println("❌ Failed to send password reset email to " + toEmail + ": " + e.getMessage());
            
            // In production, log the reset token so it can be used manually
            String environment = System.getenv("RENDER");
            if (environment != null) {
                System.err.println("🔑 MANUAL RESET TOKEN for " + toEmail + ": " + resetToken);
                System.err.println("🔗 MANUAL RESET URL: https://community-support-system.vercel.app/reset-password?token=" + resetToken);
                System.err.println("⚠️ Email service unavailable in production. Use the above URL to reset password.");
                return;
            }
            
            e.printStackTrace();
            throw new RuntimeException("Failed to send password reset email: " + e.getMessage(), e);
        }
    }
    
    public void sendEmailVerification(String toEmail, String verificationToken) {
        try {
            System.out.println("🔄 Attempting to send verification email to: " + toEmail);
            
            if (sendGridEnabled) {
                System.out.println("📧 Using SendGrid for email delivery");
                sendGridEmailService.sendVerificationEmail(toEmail, "User", verificationToken);
                return;
            }
            
            // Fallback to SMTP
            System.out.println("📧 Using SMTP for email delivery");
            sendEmailVerificationSMTP(toEmail, verificationToken);
            
        } catch (Exception e) {
            System.err.println("❌ Failed to send verification email to " + toEmail + ": " + e.getMessage());
            e.printStackTrace();
            // Don't throw exception - allow registration to continue
        }
    }
    
    private void sendPasswordResetEmailSMTP(String toEmail, String resetToken) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom(fromEmail);
        message.setTo(toEmail);
        message.setSubject("Password Reset - Community Support System");
        
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
        
        mailSender.send(message);
        System.out.println("✅ Password reset email sent successfully to: " + toEmail);
    }
    
    private void sendEmailVerificationSMTP(String toEmail, String verificationToken) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom(fromEmail);
        message.setTo(toEmail);
        message.setSubject("Email Verification - Community Support System");
        
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
    }
    
    public void sendTwoFactorCode(String toEmail, String code) {
        try {
            if (sendGridEnabled) {
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
            
            // Fallback to SMTP
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