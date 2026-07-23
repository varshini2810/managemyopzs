package com.billingplatform.model;

import com.billingplatform.model.*;
import com.billingplatform.repository.*;
import com.billingplatform.dto.*;
import com.billingplatform.security.*;
import com.billingplatform.service.*;
import com.billingplatform.exception.*;
import com.billingplatform.util.*;

import com.billingplatform.repository.InvoiceNotificationRepository;

import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.SimpleMailMessage;
import com.billingplatform.repository.CustomerRepository;
import com.billingplatform.model.Customer;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.List;

@Component
@RequiredArgsConstructor
public class NotificationDispatcherJob {

    private static final Logger log = LoggerFactory.getLogger(NotificationDispatcherJob.class);

    private final InvoiceNotificationRepository notificationRepository;
    private final JavaMailSender mailSender;
    private final CustomerRepository customerRepository;

    // Run every hour
    @Scheduled(cron = "0 0 * * * ?")
    public void dispatchPendingNotifications() {
        log.info("Starting NotificationDispatcherJob...");
        
        LocalDateTime now = LocalDateTime.now();
        List<InvoiceNotification> pending = notificationRepository.findPendingNotificationsToDispatch(now);

        for (InvoiceNotification notif : pending) {
            try {
                if (notif.getChannel() == InvoiceNotification.Channel.EMAIL) {
                    Customer customer = customerRepository.findById(notif.getInvoice().getCustomerId()).orElse(null);
                    if (customer != null && customer.getEmail() != null && !customer.getEmail().isEmpty()) {
                        SimpleMailMessage message = new SimpleMailMessage();
                        message.setTo(customer.getEmail());
                        message.setSubject("Invoice " + notif.getInvoice().getId() + " - " + notif.getType());
                        message.setText("Dear " + customer.getFirstName() + ",\n\n" +
                                "This is a notification regarding your invoice: " + notif.getInvoice().getId() + ".\n" +
                                "Total Due: $" + notif.getInvoice().getAmountDue() + "\n\n" +
                                "Thank you,\nOpz Enterprise");
                        mailSender.send(message);
                        log.info("Sent EMAIL notification for invoice {} to {}", notif.getInvoice().getId(), customer.getEmail());
                    } else {
                        log.warn("Cannot send email for invoice {}: Customer email missing", notif.getInvoice().getId());
                    }
                } else {
                    // Stub for WHATSAPP
                    log.info("Dispatching {} notification for invoice {}", notif.getType(), notif.getInvoice().getId());
                }
                
                notif.setStatus(InvoiceNotification.Status.SENT);
                notif.setSentAt(LocalDateTime.now());
            } catch (Exception e) {
                log.error("Failed to dispatch notification {}", notif.getId(), e);
                notif.setStatus(InvoiceNotification.Status.FAILED);
            }
            notificationRepository.save(notif);
        }
        
        log.info("Finished NotificationDispatcherJob. Processed {}", pending.size());
    }
}
