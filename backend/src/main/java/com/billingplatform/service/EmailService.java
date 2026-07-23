package com.billingplatform.service;

import com.billingplatform.model.*;
import com.billingplatform.repository.*;
import com.billingplatform.dto.*;
import com.billingplatform.security.*;
import com.billingplatform.service.*;
import com.billingplatform.exception.*;
import com.billingplatform.util.*;


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
    // private final EmailLogRepository emailLogRepository; // Temporarily commented out due to missing entity

    @Async
    public void sendEmail(String to, String subject, String body, String tenantId, boolean isPlatformStaff, String userId) {
        // Propagate context to background thread
        com.billingplatform.model.CurrentTenantContext.setTenantId(tenantId);
        com.billingplatform.model.CurrentTenantContext.setIsPlatformStaff(isPlatformStaff);
        com.billingplatform.model.CurrentTenantContext.setUserId(userId);
        
        try {
            log.info("Preparing to send email to {}", to);
            
            // EmailLog emailLog = new EmailLog();
            // emailLog.setRecipientEmail(to);
            // emailLog.setSubject(subject);
            // emailLog.setTemplateName("SIMPLE_TEXT");
            // emailLog.setTenantId(tenantId);
            
            try {
                SimpleMailMessage message = new SimpleMailMessage();
                message.setTo(to);
                message.setSubject(subject);
                message.setText(body);
                message.setFrom("sanjayforantigravity@gmail.com"); 

                mailSender.send(message);
                
                // emailLog.setStatus(EmailLog.EmailStatus.SENT);
                log.info("Successfully sent email to {}", to);
            } catch (Exception e) {
                log.error("Failed to send email to {}: {}", to, e.getMessage());
                // emailLog.setStatus(EmailLog.EmailStatus.FAILED);
                // emailLog.setErrorMessage(e.getMessage());
            } finally {
                // emailLogRepository.save(emailLog);
            }
        } finally {
            com.billingplatform.model.CurrentTenantContext.clear();
        }
    }
}
