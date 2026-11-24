package com.retech.passport.service;
import com.retech.passport.model.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;
@Service @Slf4j
public class NotificationService {
    @org.springframework.beans.factory.annotation.Autowired(required = false)
    private JavaMailSender mailSender;
    @Value("${spring.mail.host:}") private String mailHost;
    @Value("${retech.base-url}") private String baseUrl;
    public void sendTransferNotification(User oldOwner, User newOwner, Device device) {
        String subject = "ReTech Passport: Device Transfer - "+device.getPassportId();
        String body = String.format("Device %s transferred from %s to %s. New QR generated. View at %s/dashboard",device.getPassportId(),oldOwner.getName(),newOwner.getName(),baseUrl);
        sendEmail(newOwner.getEmail(),subject,body); sendEmail(oldOwner.getEmail(),subject,body);
    }
    public void sendTechnicianApprovalNotification(User technician, boolean approved) {
        String status = approved?"APPROVED":"REJECTED";
        sendEmail(technician.getEmail(),"ReTech: Technician Application "+status,"Your application has been "+status.toLowerCase());
    }
    private void sendEmail(String to, String subject, String body) {
        if(mailHost==null||mailHost.isBlank()){ log.info("[EMAIL STUB] To: {} | Subject: {} | Body: {}",to,subject,body); return; }
        try { SimpleMailMessage msg=new SimpleMailMessage(); msg.setTo(to); msg.setSubject(subject); msg.setText(body); mailSender.send(msg); }
        catch(Exception e){ log.warn("Failed to send email to {}: {}",to,e.getMessage()); }
    }
}