package om.community.supportsystem.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {
    
    @Autowired(required = false)
    private JavaMailSender mailSender;
    
    @Value("${spring.mail.username:noreply@community.rw}")
    private String fromEmail;
    
    public void sendPasswordResetEmail(String toEmail, String resetToken) {
        if (mailSender == null) {
            System.out.println("Email not configured. Password reset email would be sent to: " + toEmail + " with token: " + resetToken);
            return;
        }
        
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom(fromEmail);
        message.setTo(toEmail);
        message.setSubject("Password Reset - Community Support System");
        message.setText("Click the link to reset your password: " +
                "http://localhost:3000/reset-password?token=" + resetToken +
                "\n\nThis link will expire in 1 hour.");
        
        mailSender.send(message);
    }
    
    public void sendEmailVerification(String toEmail, String verificationToken) {
        if (mailSender == null) {
            System.out.println("Email not configured. Verification email would be sent to: " + toEmail + " with token: " + verificationToken);
            return;
        }
        
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom(fromEmail);
        message.setTo(toEmail);
        message.setSubject("Email Verification - Community Support System");
        message.setText("Click the link to verify your email: " +
                "http://localhost:3000/verify-email?token=" + verificationToken +
                "\n\nWelcome to Community Support System!");
        
        mailSender.send(message);
    }
    
    public void sendTwoFactorCode(String toEmail, String code) {
        if (mailSender == null) {
            System.out.println("Email not configured. 2FA code would be sent to: " + toEmail + " with code: " + code);
            return;
        }
        
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom(fromEmail);
        message.setTo(toEmail);
        message.setSubject("Two-Factor Authentication Code");
        message.setText("Your verification code is: " + code +
                "\n\nThis code will expire in 5 minutes.");
        
        mailSender.send(message);
    }
}