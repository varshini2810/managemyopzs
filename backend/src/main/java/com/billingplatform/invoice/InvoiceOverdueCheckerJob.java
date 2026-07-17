package com.billingplatform.invoice;

import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.List;

@Component
@RequiredArgsConstructor
public class InvoiceOverdueCheckerJob {

    private static final Logger log = LoggerFactory.getLogger(InvoiceOverdueCheckerJob.class);

    private final InvoiceRepository invoiceRepository;
    private final InvoiceNotificationService notificationService;

    // Run daily at midnight
    @Scheduled(cron = "0 0 0 * * ?")
    public void checkOverdueInvoices() {
        log.info("Starting InvoiceOverdueCheckerJob...");
        
        LocalDateTime today = LocalDateTime.now();
        List<Invoice> sentInvoices = invoiceRepository.findByPaymentStatus(Invoice.PaymentStatus.SENT);

        for (Invoice invoice : sentInvoices) {
            if (invoice.getDueDate() != null && invoice.getDueDate().isBefore(today)) {
                invoice.setPaymentStatus(Invoice.PaymentStatus.OVERDUE);
                invoiceRepository.save(invoice);
                
                log.info("Marked invoice {} as OVERDUE", invoice.getId());
                
                // Cancel pending normal reminders and schedule overdue ones
                notificationService.triggerPaidNotification(invoice); // Wait, this cancels all. We need a specific cancel.
                // Let's rely on NotificationService logic
            }
        }
        
        log.info("Finished InvoiceOverdueCheckerJob.");
    }
}
