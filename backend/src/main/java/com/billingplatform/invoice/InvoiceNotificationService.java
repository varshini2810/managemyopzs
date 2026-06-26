package com.billingplatform.invoice;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class InvoiceNotificationService {

    private final InvoiceNotificationRepository notificationRepository;
    private final BusinessDayUtils businessDayUtils;
    private final InvoiceRepository invoiceRepository;
    private final com.billingplatform.customer.CustomerRepository customerRepository;

    public List<InvoiceNotification> getNotificationsForInvoice(String invoiceId) {
        return notificationRepository.findByInvoiceIdOrderByScheduledForDesc(invoiceId);
    }

    @Transactional
    public void scheduleInitialNotifications(Invoice invoice) {
        LocalDateTime now = LocalDateTime.now();
        
        com.billingplatform.customer.Customer customer = customerRepository.findById(invoice.getCustomerId()).orElse(null);
        String email = customer != null ? customer.getEmail() : null;
        String phone = invoice.getCustomerPhone() != null ? invoice.getCustomerPhone() : (customer != null ? customer.getPhone() : null);
        
        // 1. Created (immediate)
        if (email != null && !email.isEmpty()) {
            createNotification(invoice, InvoiceNotification.NotificationType.CREATED, InvoiceNotification.Channel.EMAIL, now);
        }
        if (phone != null && !phone.isEmpty()) {
            createNotification(invoice, InvoiceNotification.NotificationType.CREATED, InvoiceNotification.Channel.WHATSAPP, now);
        }
        
        // 2. Reminder 1 (+2 biz days)
        if (email != null && !email.isEmpty()) {
            createNotification(invoice, InvoiceNotification.NotificationType.REMINDER_1, InvoiceNotification.Channel.EMAIL, businessDayUtils.addBusinessDays(now, 2));
        }

        // 3. Reminder 2 (+4 biz days)
        if (email != null && !email.isEmpty()) {
            createNotification(invoice, InvoiceNotification.NotificationType.REMINDER_2, InvoiceNotification.Channel.EMAIL, businessDayUtils.addBusinessDays(now, 4));
        }
    }

    @Transactional
    public void scheduleOverdueNotifications(Invoice invoice) {
        LocalDateTime now = LocalDateTime.now();
        
        // 1. Overdue (immediate)
        createNotification(invoice, InvoiceNotification.NotificationType.OVERDUE, InvoiceNotification.Channel.EMAIL, now);
        
        // 2. Overdue Reminder 1 (+2 biz days)
        createNotification(invoice, InvoiceNotification.NotificationType.OVERDUE_REMINDER_1, InvoiceNotification.Channel.EMAIL, businessDayUtils.addBusinessDays(now, 2));

        // 3. Overdue Reminder 2 (+4 biz days)
        createNotification(invoice, InvoiceNotification.NotificationType.OVERDUE_REMINDER_2, InvoiceNotification.Channel.EMAIL, businessDayUtils.addBusinessDays(now, 4));
    }

    @Transactional
    public void triggerPaidNotification(Invoice invoice) {
        boolean alreadySent = notificationRepository.existsByInvoiceIdAndTypeAndStatus(
                invoice.getId(), InvoiceNotification.NotificationType.PAID, InvoiceNotification.Status.SENT);
        
        if (!alreadySent) {
            // Cancel any pending reminders
            notificationRepository.cancelPendingForInvoice(invoice.getId());
            // Schedule Paid immediately
            createNotification(invoice, InvoiceNotification.NotificationType.PAID, InvoiceNotification.Channel.EMAIL, LocalDateTime.now());
        }
    }

    private void createNotification(Invoice invoice, InvoiceNotification.NotificationType type, InvoiceNotification.Channel channel, LocalDateTime scheduledFor) {
        InvoiceNotification notif = new InvoiceNotification();
        notif.setInvoice(invoice);
        notif.setTenantId(invoice.getTenantId());
        notif.setType(type);
        notif.setChannel(channel);
        notif.setScheduledFor(scheduledFor);
        notif.setStatus(InvoiceNotification.Status.PENDING);
        notificationRepository.save(notif);
    }

    @Transactional
    public void resendNotification(String notificationId) {
        InvoiceNotification notif = notificationRepository.findById(notificationId).orElseThrow();
        notif.setStatus(InvoiceNotification.Status.PENDING);
        notif.setScheduledFor(LocalDateTime.now());
        notificationRepository.save(notif);
    }
}
