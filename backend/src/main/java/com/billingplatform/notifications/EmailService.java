package com.billingplatform.notifications;

import com.billingplatform.logs.EmailLog;
import com.billingplatform.logs.EmailLogRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class EmailService {

    private final JavaMailSender mailSender;
    private final EmailLogRepository emailLogRepository;

    @Async
    public void sendEmail(String to, String subject, String body, String tenantId, boolean isPlatformStaff, String userId) {
        // Propagate context to background thread
        com.billingplatform.auth.CurrentTenantContext.setTenantId(tenantId);
        com.billingplatform.auth.CurrentTenantContext.setIsPlatformStaff(isPlatformStaff);
        com.billingplatform.auth.CurrentTenantContext.setUserId(userId);
        
        try {
            log.info("Preparing to send email to {}", to);
            
            EmailLog emailLog = new EmailLog();
            emailLog.setRecipientEmail(to);
            emailLog.setSubject(subject);
            emailLog.setTemplateName("SIMPLE_TEXT");
            emailLog.setTenantId(tenantId);
            
            try {
                SimpleMailMessage message = new SimpleMailMessage();
                message.setTo(to);
                message.setSubject(subject);
                message.setText(body);
                message.setFrom("sanjayforantigravity@gmail.com"); 

                mailSender.send(message);
                
                emailLog.setStatus(EmailLog.EmailStatus.SENT);
                log.info("Successfully sent email to {}", to);
            } catch (Exception e) {
                log.error("Failed to send email to {}: {}", to, e.getMessage());
                emailLog.setStatus(EmailLog.EmailStatus.FAILED);
                emailLog.setErrorMessage(e.getMessage());
            } finally {
                emailLogRepository.save(emailLog);
            }
        } finally {
            com.billingplatform.auth.CurrentTenantContext.clear();
        }
    }
}
