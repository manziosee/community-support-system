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
    
    @Value("${frontend.url:https://community-support-system.vercel.app}")
    private String frontendUrl;
    
    private String getFrontendUrl() {
        // Check if we're running on Render (production)
        String renderEnv = System.getenv("RENDER");
        if (renderEnv != null) {
            // Production - use configured frontend URL
            return frontendUrl;
        }
        
        // Local development - check for custom frontend URL
        String localUrl = System.getenv("FRONTEND_URL");
        if (localUrl != null && !localUrl.isEmpty()) {
            return localUrl;
        }
        
        // Default local frontend URL (port 3001)
        return "http://localhost:3001";
    }

    public void sendEmail(String toEmail, String subject, String htmlContent) throws IOException {
        Email from = new Email(fromEmail, fromName);
        Email to = new Email(toEmail);
        Content content = new Content("text/html", htmlContent);
        Mail mail = new Mail(from, subject, to, content);
        
        // Add authentication headers to improve deliverability
        mail.setReplyTo(new Email(fromEmail, fromName));
        
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
        String verifyUrl = getFrontendUrl() + "/verify-email?token=" + verificationToken;
        return """
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Email Verification - Community Support System</title>
            </head>
            <body style="margin: 0; padding: 0; font-family: Arial, Helvetica, sans-serif; background-color: #f4f4f4;">
                <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%%">
                    <tr>
                        <td align="center" style="padding: 40px 0;">
                            <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="600" style="background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                                <!-- Header -->
                                <tr>
                                    <td style="padding: 40px 40px 20px 40px; text-align: center; background-color: #2c5aa0; border-radius: 8px 8px 0 0;">
                                        <h1 style="margin: 0; color: #ffffff; font-size: 24px; font-weight: bold;">Welcome to Community Support System!</h1>
                                    </td>
                                </tr>
                                <!-- Content -->
                                <tr>
                                    <td style="padding: 40px;">
                                        <h2 style="margin: 0 0 20px 0; color: #333333; font-size: 20px;">Verify Your Email Address</h2>
                                        <p style="margin: 0 0 20px 0; color: #666666; font-size: 16px; line-height: 1.5;">Hello %s,</p>
                                        <p style="margin: 0 0 30px 0; color: #666666; font-size: 16px; line-height: 1.5;">Thank you for registering with Community Support System. Please verify your email address by clicking the button below:</p>
                                        
                                        <!-- Button -->
                                        <table role="presentation" cellspacing="0" cellpadding="0" border="0" style="margin: 0 auto;">
                                            <tr>
                                                <td style="border-radius: 6px; background-color: #28a745;">
                                                    <a href="%s" 
                                                       target="_blank" 
                                                       style="display: inline-block; padding: 16px 32px; font-family: Arial, sans-serif; font-size: 16px; color: #ffffff; text-decoration: none; border-radius: 6px; font-weight: bold;">Verify Email Address</a>
                                                </td>
                                            </tr>
                                        </table>
                                        
                                        <p style="margin: 30px 0 20px 0; color: #666666; font-size: 14px; line-height: 1.5;">If the button doesn't work, copy and paste this link into your browser:</p>
                                        <p style="margin: 0 0 30px 0; word-break: break-all; color: #2c5aa0; font-size: 14px; background-color: #f8f9fa; padding: 10px; border-radius: 4px;">%s</p>
                                        
                                        <div style="border-top: 1px solid #eee; padding-top: 20px; margin-top: 30px;">
                                            <p style="margin: 0 0 10px 0; color: #999999; font-size: 12px;">⏰ This verification link will expire in 24 hours.</p>
                                            <p style="margin: 0; color: #999999; font-size: 12px;">🔒 If you didn't create an account, please ignore this email.</p>
                                        </div>
                                    </td>
                                </tr>
                                <!-- Footer -->
                                <tr>
                                    <td style="padding: 20px 40px; text-align: center; background-color: #f8f9fa; border-radius: 0 0 8px 8px;">
                                        <p style="margin: 0; color: #999999; font-size: 12px;">© 2025 Community Support System. This is an automated message.</p>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                </table>
            </body>
            </html>
            """.formatted(userName, verifyUrl, verifyUrl);
    }

    private String buildPasswordResetEmailTemplate(String userName, String resetToken) {
        String resetUrl = getFrontendUrl() + "/reset-password?token=" + resetToken;
        return """
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Password Reset - Community Support System</title>
                <!--[if mso]>
                <noscript>
                    <xml>
                        <o:OfficeDocumentSettings>
                            <o:PixelsPerInch>96</o:PixelsPerInch>
                        </o:OfficeDocumentSettings>
                    </xml>
                </noscript>
                <![endif]-->
            </head>
            <body style="margin: 0; padding: 0; font-family: Arial, Helvetica, sans-serif; background-color: #f4f4f4;">
                <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%%">
                    <tr>
                        <td align="center" style="padding: 40px 0;">
                            <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="600" style="background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                                <!-- Header -->
                                <tr>
                                    <td style="padding: 40px 40px 20px 40px; text-align: center; background-color: #2c5aa0; border-radius: 8px 8px 0 0;">
                                        <h1 style="margin: 0; color: #ffffff; font-size: 24px; font-weight: bold;">Community Support System</h1>
                                    </td>
                                </tr>
                                <!-- Content -->
                                <tr>
                                    <td style="padding: 40px;">
                                        <h2 style="margin: 0 0 20px 0; color: #333333; font-size: 20px;">Password Reset Request</h2>
                                        <p style="margin: 0 0 20px 0; color: #666666; font-size: 16px; line-height: 1.5;">Hello %s,</p>
                                        <p style="margin: 0 0 30px 0; color: #666666; font-size: 16px; line-height: 1.5;">We received a request to reset your password for your Community Support System account. Click the button below to reset your password:</p>
                                        
                                        <!-- Button -->
                                        <table role="presentation" cellspacing="0" cellpadding="0" border="0" style="margin: 0 auto;">
                                            <tr>
                                                <td style="border-radius: 6px; background-color: #dc3545;">
                                                    <a href="%s" 
                                                       target="_blank" 
                                                       style="display: inline-block; padding: 16px 32px; font-family: Arial, sans-serif; font-size: 16px; color: #ffffff; text-decoration: none; border-radius: 6px; font-weight: bold;">Reset Password</a>
                                                </td>
                                            </tr>
                                        </table>
                                        
                                        <p style="margin: 30px 0 20px 0; color: #666666; font-size: 14px; line-height: 1.5;">If the button doesn't work, copy and paste this link into your browser:</p>
                                        <p style="margin: 0 0 30px 0; word-break: break-all; color: #2c5aa0; font-size: 14px; background-color: #f8f9fa; padding: 10px; border-radius: 4px;">%s</p>
                                        
                                        <div style="border-top: 1px solid #eee; padding-top: 20px; margin-top: 30px;">
                                            <p style="margin: 0 0 10px 0; color: #999999; font-size: 12px;">⏰ This reset link will expire in 1 hour for security reasons.</p>
                                            <p style="margin: 0; color: #999999; font-size: 12px;">🔒 If you didn't request a password reset, please ignore this email. Your password will remain unchanged.</p>
                                        </div>
                                    </td>
                                </tr>
                                <!-- Footer -->
                                <tr>
                                    <td style="padding: 20px 40px; text-align: center; background-color: #f8f9fa; border-radius: 0 0 8px 8px;">
                                        <p style="margin: 0; color: #999999; font-size: 12px;">© 2025 Community Support System. This is an automated message.</p>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                </table>
            </body>
            </html>
            """.formatted(userName, resetUrl, resetUrl);
    }
}