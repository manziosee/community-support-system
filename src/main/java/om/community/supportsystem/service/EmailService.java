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
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(fromEmail);
            message.setTo(toEmail);
            message.setSubject("Password Reset - Community Support System");
            message.setText("Click the link to reset your password: " +
                    "https://community-support-system.vercel.app/reset-password?token=" + resetToken +
                    "\n\nThis link will expire in 1 hour.");
            
            mailSender.send(message);
            System.out.println("Password reset email sent to: " + toEmail);
        } catch (Exception e) {
            System.err.println("Failed to send password reset email: " + e.getMessage());
            throw new RuntimeException("Failed to send email", e);
        }
    }
    
    public void sendEmailVerification(String toEmail, String verificationToken) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(fromEmail);
            message.setTo(toEmail);
            message.setSubject("Email Verification - Community Support System");
            message.setText("Click the link to verify your email: " +
                    "https://community-support-system.vercel.app/verify-email?token=" + verificationToken +
                    "\n\nWelcome to Community Support System!");
            
            mailSender.send(message);
            System.out.println("Verification email sent to: " + toEmail);
        } catch (Exception e) {
            System.err.println("Failed to send verification email: " + e.getMessage());
            throw new RuntimeException("Failed to send email", e);
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