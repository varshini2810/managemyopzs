package com.billingplatform.invoice;

import com.billingplatform.model.*;
import com.billingplatform.repository.*;
import com.billingplatform.dto.*;
import com.billingplatform.security.*;
import com.billingplatform.service.*;
import com.billingplatform.exception.*;
import com.billingplatform.util.*;


import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@ActiveProfiles("test")
@Transactional
public class InvoiceServiceIntegrationTest {

    @Autowired
    private InvoiceService invoiceService;

    @Autowired
    private InvoiceRepository invoiceRepository;

    @Autowired
    private InvoiceNotificationRepository notificationRepository;

    @Test
    public void testEndToEndInvoiceCreationForNewTenant() {
        String testTenantId = "test-tenant-123";
        
        Invoice invoice = new Invoice();
        invoice.setCustomerId("test-cust-123");
        invoice.setCurrency("USD");
        invoice.setTaxPercentage(new BigDecimal("10"));

        InvoiceLineItem item = new InvoiceLineItem();
        item.setDescription("Test Service");
        item.setQuantity(2);
        item.setUnitAmount(new BigDecimal("100"));
        item.setItemGstPercentage(new BigDecimal("5"));

        invoice.setLineItems(List.of(item));

        Invoice saved = invoiceService.createInvoice(invoice, testTenantId);

        assertNotNull(saved.getId(), "Invoice ID should be generated");
        assertTrue(saved.getId().startsWith("INV-"), "Invoice ID should start with INV-");
        assertEquals(testTenantId, saved.getTenantId(), "Tenant ID should be set correctly");
        
        // 2 qty * 100 = 200. Tax = 5% of 200 = 10. Total = 210
        assertEquals(0, new BigDecimal("200").compareTo(saved.getSubtotal()), "Subtotal should be 200");
        assertEquals(0, new BigDecimal("10").compareTo(saved.getTaxTotal()), "Tax should be 10");
        assertEquals(0, new BigDecimal("210").compareTo(saved.getTotal()), "Total should be 210");

        List<InvoiceNotification> notifications = notificationRepository.findByInvoiceIdOrderByScheduledForDesc(saved.getId());
        assertFalse(notifications.isEmpty(), "Notification should be enqueued");
        assertTrue(notifications.stream().anyMatch(n -> InvoiceNotification.Status.PENDING == n.getStatus()), "Should have pending notification");
    }
}
