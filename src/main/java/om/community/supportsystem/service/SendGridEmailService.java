package om.community.supportsystem.service;

import com.sendgrid.*;
import com.sendgrid.helpers.mail.Mail;
import com.sendgrid.helpers.mail.objects.Content;
import com.sendgrid.helpers.mail.objects.Email;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.IOException;

@Service
public class SendGridEmailService {

    @Value("${sendgrid.api.key}")
    private String apiKey;

    @Value("${sendgrid.from.email}")
    private String fromEmail;

    @Value("${sendgrid.from.name}")
    private String fromName;

    public void sendEmail(String toEmail, String subject, String htmlContent) throws IOException {
        Email from = new Email(fromEmail, fromName);
        Email to = new Email(toEmail);
        Content content = new Content("text/html", htmlContent);
        Mail mail = new Mail(from, subject, to, content);

        SendGrid sg = new SendGrid(apiKey);
        Request request = new Request();
        
        try {
            request.setMethod(Method.POST);
            request.setEndpoint("mail/send");
            request.setBody(mail.build());
            
            Response response = sg.api(request);
            
            if (response.getStatusCode() >= 400) {
                throw new RuntimeException("Failed to send email. Status: " + response.getStatusCode() + 
                                         ", Body: " + response.getBody());
            }
            
            System.out.println("✅ Email sent successfully to: " + toEmail);
            System.out.println("📧 Subject: " + subject);
            System.out.println("📊 Status Code: " + response.getStatusCode());
            
        } catch (IOException ex) {
            System.err.println("❌ Error sending email: " + ex.getMessage());
            throw ex;
        }
    }

    public void sendVerificationEmail(String toEmail, String userName, String verificationToken) throws IOException {
        String subject = "Verify Your Email - Community Support System";
        String htmlContent = buildVerificationEmailTemplate(userName, verificationToken);
        sendEmail(toEmail, subject, htmlContent);
    }

    public void sendPasswordResetEmail(String toEmail, String userName, String resetToken) throws IOException {
        String subject = "Password Reset - Community Support System";
        String htmlContent = buildPasswordResetEmailTemplate(userName, resetToken);
        sendEmail(toEmail, subject, htmlContent);
    }

    private String buildVerificationEmailTemplate(String userName, String verificationToken) {
        return """
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <title>Email Verification</title>
            </head>
            <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
                <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
                    <h2 style="color: #2c5aa0;">Welcome to Community Support System!</h2>
                    <p>Hello %s,</p>
                    <p>Thank you for registering with Community Support System. Please verify your email address by clicking the button below:</p>
                    <div style="text-align: center; margin: 30px 0;">
                        <a href="https://community-support-system.vercel.app/verify-email?token=%s" 
                           style="background-color: #2c5aa0; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
                            Verify Email Address
                        </a>
                    </div>
                    <p>If the button doesn't work, copy and paste this link into your browser:</p>
                    <p style="word-break: break-all; color: #666;">
                        https://community-support-system.vercel.app/verify-email?token=%s
                    </p>
                    <p>This verification link will expire in 24 hours.</p>
                    <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">
                    <p style="font-size: 12px; color: #666;">
                        If you didn't create an account, please ignore this email.
                    </p>
                </div>
            </body>
            </html>
            """.formatted(userName, verificationToken, verificationToken);
    }

    private String buildPasswordResetEmailTemplate(String userName, String resetToken) {
        return """
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <title>Password Reset</title>
            </head>
            <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
                <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
                    <h2 style="color: #2c5aa0;">Password Reset Request</h2>
                    <p>Hello %s,</p>
                    <p>We received a request to reset your password for your Community Support System account.</p>
                    <div style="text-align: center; margin: 30px 0;">
                        <a href="https://community-support-system.vercel.app/reset-password?token=%s" 
                           style="background-color: #dc3545; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
                            Reset Password
                        </a>
                    </div>
                    <p>If the button doesn't work, copy and paste this link into your browser:</p>
                    <p style="word-break: break-all; color: #666;">
                        https://community-support-system.vercel.app/reset-password?token=%s
                    </p>
                    <p>This reset link will expire in 1 hour for security reasons.</p>
                    <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">
                    <p style="font-size: 12px; color: #666;">
                        If you didn't request a password reset, please ignore this email. Your password will remain unchanged.
                    </p>
                </div>
            </body>
            </html>
            """.formatted(userName, resetToken, resetToken);
    }
}