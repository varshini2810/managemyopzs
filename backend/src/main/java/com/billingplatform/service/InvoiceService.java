package com.billingplatform.service;

import com.billingplatform.model.*;
import com.billingplatform.repository.*;
import com.billingplatform.dto.*;
import com.billingplatform.security.*;
import com.billingplatform.service.*;
import com.billingplatform.exception.*;
import com.billingplatform.util.*;

import com.billingplatform.model.Invoice;
import com.billingplatform.repository.InvoiceSequenceRepository;
import com.billingplatform.repository.InvoiceRepository;

import com.billingplatform.model.AuditLog;
import com.billingplatform.repository.AuditLogRepository;
import com.billingplatform.model.Tenant;
import com.billingplatform.repository.TenantRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import org.springframework.transaction.annotation.Transactional;
import lombok.extern.slf4j.Slf4j;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Slf4j
@Service
@RequiredArgsConstructor
public class InvoiceService {

    private final InvoiceRepository invoiceRepository;
    private final InvoiceSequenceRepository invoiceSequenceRepository;
    private final TenantRepository tenantRepository;
    private final InvoiceNotificationService notificationService;
    private final AuditLogRepository auditLogRepository;
    private final ObjectMapper objectMapper = new ObjectMapper();

    @Transactional(readOnly = true)
    public Page<Invoice> getInvoices(String status, String customerId, String search, Pageable pageable) {
        Invoice.InvoiceStatus invStatus = (status != null && !status.trim().isEmpty()) ? Invoice.InvoiceStatus.valueOf(status.toUpperCase()) : null;
        Page<Invoice> page = invoiceRepository.findAllWithFilters(invStatus, customerId, search, pageable);
        page.forEach(inv -> org.hibernate.Hibernate.initialize(inv.getLineItems()));
        return page;
    }

    @Transactional(readOnly = true)
    public Invoice getInvoice(String id) {
        Invoice invoice = invoiceRepository.findByIdAndDeletedAtIsNull(id)
                .orElseThrow(() -> new RuntimeException("Invoice not found"));
        org.hibernate.Hibernate.initialize(invoice.getLineItems());
        return invoice;
    }

    private String generateNextInvoiceNumber(String tenantId) {
        log.debug("Generating next invoice number for tenant: {}", tenantId);
        
        if (tenantId == null || tenantId.trim().isEmpty() || "PLATFORM".equalsIgnoreCase(tenantId) || "null".equalsIgnoreCase(tenantId)) {
            throw new IllegalArgumentException("Cannot generate invoice number without a valid tenant context");
        }

        Tenant tenant = tenantRepository.findById(tenantId)
                .orElseThrow(() -> new RuntimeException("Tenant not found"));
        String prefix = tenant.getName() != null && tenant.getName().length() >= 3 
                ? tenant.getName().substring(0, 3).toUpperCase() 
                : "TEN";
        String seqTenantId = tenantId;

        int year = LocalDateTime.now().getYear();

        invoiceSequenceRepository.incrementSequence(seqTenantId, year);
        int currentSeq = invoiceSequenceRepository.getLastSequence(seqTenantId, year);

        String generated = String.format("INV-%s-%d-%06d", prefix, year, currentSeq);
        log.info("Successfully generated invoice number: {} for tenant: {}", generated, seqTenantId);
        return generated;
    }

    @Transactional
    public Invoice createInvoice(Invoice invoice, String tenantId) {
        log.info("Starting invoice creation flow for tenant: {}. DTO: {}", tenantId, invoice);
        
        if (invoice.getId() == null || invoice.getId().isEmpty()) {
            invoice.setId(generateNextInvoiceNumber(tenantId));
        }

        invoice.setStatus(Invoice.InvoiceStatus.POSTED); // or DRAFT based on workflow
        if (invoice.getPaymentStatus() == null) {
            invoice.setPaymentStatus(Invoice.PaymentStatus.SENT);
        }
        
        BigDecimal subtotal = BigDecimal.ZERO;
        BigDecimal taxTotal = BigDecimal.ZERO;

        if (invoice.getLineItems() != null) {
            for (InvoiceLineItem item : invoice.getLineItems()) {
                log.debug("Processing line item: {}", item.getDescription());
                item.setInvoice(invoice);
                BigDecimal discount = item.getDiscountAmount() != null ? item.getDiscountAmount() : BigDecimal.ZERO;
                item.setDiscountAmount(discount);
                BigDecimal amt = item.getUnitAmount().multiply(new BigDecimal(item.getQuantity()))
                        .subtract(discount);
                item.setAmount(amt);
                
                subtotal = subtotal.add(amt);
                if (item.getTaxAmount() != null) {
                    taxTotal = taxTotal.add(item.getTaxAmount());
                } else if (item.getItemGstPercentage() != null) {
                    BigDecimal tax = amt.multiply(item.getItemGstPercentage()).divide(new BigDecimal("100"));
                    item.setTaxAmount(tax);
                    taxTotal = taxTotal.add(tax);
                } else if (invoice.getTaxPercentage() != null) {
                    BigDecimal tax = amt.multiply(invoice.getTaxPercentage()).divide(new BigDecimal("100"));
                    item.setTaxAmount(tax);
                    taxTotal = taxTotal.add(tax);
                }
                log.debug("Computed line item amount: {}, tax: {}", amt, item.getTaxAmount());
            }
        }
        
        invoice.setSubtotal(subtotal);
        invoice.setTaxTotal(taxTotal);
        invoice.setTotal(subtotal.add(taxTotal));
        invoice.setAmountDue(invoice.getTotal().subtract(invoice.getAmountPaid() != null ? invoice.getAmountPaid() : BigDecimal.ZERO));
        if (tenantId == null || tenantId.trim().isEmpty() || "PLATFORM".equalsIgnoreCase(tenantId) || "null".equalsIgnoreCase(tenantId)) {
            throw new IllegalArgumentException("Cannot create invoice without a valid tenant context");
        }
        invoice.setTenantId(tenantId);
        
        log.info("Committing invoice {} to database. Subtotal: {}, Tax: {}, Total: {}", invoice.getId(), subtotal, taxTotal, invoice.getTotal());
        Invoice saved;
        try {
            saved = invoiceRepository.save(invoice);
            log.info("Successfully committed invoice {} to database", saved.getId());
        } catch (Exception e) {
            log.error("Failed to commit invoice to database: {}", e.getMessage(), e);
            throw e;
        }

        try {
            notificationService.scheduleInitialNotifications(saved);
            log.info("Successfully enqueued notifications for invoice {}", saved.getId());
        } catch (Exception e) {
            log.error("Failed to schedule notifications for invoice {}: {}", saved.getId(), e.getMessage(), e);
        }
        
        return saved;
    }

    @Transactional
    public Invoice recordOfflinePayment(String id, BigDecimal amount) {
        Invoice invoice = getInvoice(id);
        if (invoice.getStatus() == Invoice.InvoiceStatus.PAID || invoice.getPaymentStatus() == Invoice.PaymentStatus.PAID) {
            throw new RuntimeException("Invoice is already paid");
        }
        
        invoice.setAmountPaid(invoice.getAmountPaid().add(amount));
        invoice.setAmountDue(invoice.getTotal().subtract(invoice.getAmountPaid()));
        
        if (invoice.getAmountDue().compareTo(BigDecimal.ZERO) <= 0) {
            invoice.setAmountDue(BigDecimal.ZERO);
            invoice.setStatus(Invoice.InvoiceStatus.PAID);
            invoice.setPaymentStatus(Invoice.PaymentStatus.PAID);
            invoice.setPaidAt(LocalDateTime.now());
            Invoice saved = invoiceRepository.save(invoice);
            notificationService.triggerPaidNotification(saved);
            return saved;
        } else {
            invoice.setStatus(Invoice.InvoiceStatus.PAYMENT_DUE);
            return invoiceRepository.save(invoice);
        }
    }

    @Transactional
    public Invoice markAsPaid(String id, java.util.Map<String, String> payload, String userId, String ipAddress) {
        Invoice invoice = getInvoice(id);
        String oldStatus = invoice.getPaymentStatus() != null ? invoice.getPaymentStatus().name() : "SENT";
        
        invoice.setAmountPaid(invoice.getTotal());
        invoice.setAmountDue(BigDecimal.ZERO);
        invoice.setStatus(Invoice.InvoiceStatus.PAID);
        invoice.setPaymentStatus(Invoice.PaymentStatus.PAID);
        invoice.setPaidAt(payload.containsKey("paymentDate") ? 
            LocalDateTime.parse(payload.get("paymentDate") + "T00:00:00") : LocalDateTime.now());
        
        Invoice saved = invoiceRepository.save(invoice);
        notificationService.triggerPaidNotification(saved);
        
        // Write AuditLog
        try {
            AuditLog log = AuditLog.builder()
                .entityType("invoice")
                .entityId(saved.getId())
                .action("STATUS_CHANGED")
                .changedBy(userId)
                .ipAddress(ipAddress)
                .oldValue(objectMapper.writeValueAsString(java.util.Map.of("payment_status", oldStatus.toLowerCase())))
                .newValue(objectMapper.writeValueAsString(java.util.Map.of(
                    "payment_status", "paid",
                    "payment_method", payload.getOrDefault("paymentMethod", ""),
                    "reference_number", payload.getOrDefault("referenceNumber", ""),
                    "notes", payload.getOrDefault("notes", "")
                )))
                .build();
            auditLogRepository.save(log);
        } catch (Exception e) {
            e.printStackTrace();
        }
        
        return saved;
    }

    @Transactional
    public Invoice voidInvoice(String id) {
        Invoice invoice = getInvoice(id);
        invoice.setStatus(Invoice.InvoiceStatus.VOIDED);
        return invoiceRepository.save(invoice);
    }
}

