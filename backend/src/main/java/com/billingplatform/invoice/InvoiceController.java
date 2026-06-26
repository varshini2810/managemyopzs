package com.billingplatform.invoice;

import com.billingplatform.auth.CustomUserDetails;
import com.billingplatform.common.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import jakarta.servlet.http.HttpServletRequest;

@RestController
@RequestMapping("/api/invoices")
@RequiredArgsConstructor
public class InvoiceController {

    private final InvoiceService invoiceService;
    private final InvoiceNotificationService notificationService;
    private final PdfGeneratorService pdfGeneratorService;

    private String getTenantId(Authentication auth) {
        if (auth.getPrincipal() instanceof CustomUserDetails user) {
            String tenantId = user.getTenantId();
            if (tenantId == null || tenantId.trim().isEmpty() || "PLATFORM".equalsIgnoreCase(tenantId) || "null".equalsIgnoreCase(tenantId)) {
                throw new org.springframework.web.server.ResponseStatusException(org.springframework.http.HttpStatus.BAD_REQUEST, "No valid tenant context available. Please provide a valid tenant ID.");
            }
            return tenantId;
        }
        throw new RuntimeException("Unauthorized");
    }

    @PreAuthorize("@accessControl.hasPermission(null, 'INVOICE_VIEW')")
    @GetMapping
    public ResponseEntity<ApiResponse<Page<Invoice>>> getInvoices(
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String customerId,
            @RequestParam(required = false) String search,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            Authentication auth) {
        Page<Invoice> invoices = invoiceService.getInvoices(status, customerId, search, PageRequest.of(page, size));
        return ResponseEntity.ok(ApiResponse.success(invoices));
    }

    @PreAuthorize("@accessControl.hasPermission(null, 'INVOICE_VIEW')")
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Invoice>> getInvoice(@PathVariable String id, Authentication auth) {
        return ResponseEntity.ok(ApiResponse.success(invoiceService.getInvoice(id)));
    }

    @PreAuthorize("@accessControl.hasPermission(null, 'INVOICE_CREATE')")
    @PostMapping
    public ResponseEntity<ApiResponse<Invoice>> createInvoice(@jakarta.validation.Valid @RequestBody Invoice invoice, Authentication auth) {
        String tenantId = getTenantId(auth);
        return ResponseEntity.ok(ApiResponse.success(invoiceService.createInvoice(invoice, tenantId)));
    }

    @PreAuthorize("@accessControl.hasPermission(null, 'INVOICE_VIEW')")
    @GetMapping("/{id}/preview")
    public ResponseEntity<ApiResponse<Invoice>> previewInvoice(@PathVariable String id, Authentication auth) {
        // For preview, we might just return the invoice since the frontend can render it
        // If it was a dynamic preview of unsaved data, we'd accept POST with body.
        // The prompt says "returns rendered preview data" but the creation is POST /api/invoices
        return ResponseEntity.ok(ApiResponse.success(invoiceService.getInvoice(id)));
    }

    @PreAuthorize("@accessControl.hasPermission(null, 'INVOICE_VIEW')")
    @GetMapping(value = "/{id}/download", produces = "application/pdf")
    public ResponseEntity<?> getInvoicePdf(@PathVariable String id, Authentication auth) {
        try {
            Invoice invoice = invoiceService.getInvoice(id);
            if (invoice == null) {
                return ResponseEntity.status(org.springframework.http.HttpStatus.NOT_FOUND)
                        .body(java.util.Map.of("success", false, "message", "Invoice not found"));
            }
            byte[] pdfBytes = pdfGeneratorService.generateInvoicePdf(invoice);
            
            org.springframework.http.HttpHeaders headers = new org.springframework.http.HttpHeaders();
            headers.setContentType(org.springframework.http.MediaType.APPLICATION_PDF);
            headers.add("Content-Disposition", "attachment; filename=\"Invoice-" + id + ".pdf\"");
            headers.add("Cache-Control", "no-cache, no-store, must-revalidate");
            headers.add("Pragma", "no-cache");
            headers.add("Expires", "0");
            
            return new ResponseEntity<>(pdfBytes, headers, org.springframework.http.HttpStatus.OK);
        } catch (com.billingplatform.common.ResourceNotFoundException e) {
            return ResponseEntity.status(org.springframework.http.HttpStatus.NOT_FOUND)
                    .body(java.util.Map.of("success", false, "message", "Invoice not found"));
        } catch (Exception e) {
            return ResponseEntity.status(org.springframework.http.HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(java.util.Map.of("success", false, "message", "Failed to generate PDF"));
        }
    }

    @PreAuthorize("@accessControl.hasPermission(null, 'INVOICE_MARK_PAID')")
    @PutMapping("/{id}/mark-paid")
    public ResponseEntity<ApiResponse<Invoice>> markAsPaid(@PathVariable String id, @RequestBody java.util.Map<String, String> payload, Authentication auth, HttpServletRequest request) {
        String userId = "system";
        if (auth.getPrincipal() instanceof CustomUserDetails user) {
            userId = user.getUserId();
        }
        return ResponseEntity.ok(ApiResponse.success(invoiceService.markAsPaid(id, payload, userId, request.getRemoteAddr())));
    }

    @PreAuthorize("@accessControl.hasPermission(null, 'INVOICE_CREATE')")
    @PostMapping("/{id}/record-payment")
    public ResponseEntity<ApiResponse<Invoice>> recordPayment(
            @PathVariable String id,
            @RequestBody java.util.Map<String, Object> body,
            Authentication auth) {
        java.math.BigDecimal amount = new java.math.BigDecimal(body.get("amount").toString());
        return ResponseEntity.ok(ApiResponse.success(invoiceService.recordOfflinePayment(id, amount)));
    }

    @PreAuthorize("@accessControl.hasPermission(null, 'INVOICE_VOID')")
    @PostMapping("/{id}/void")
    public ResponseEntity<ApiResponse<Invoice>> voidInvoice(@PathVariable String id, Authentication auth) {
        return ResponseEntity.ok(ApiResponse.success(invoiceService.voidInvoice(id)));
    }

    @PreAuthorize("@accessControl.hasPermission(null, 'INVOICE_VIEW')")
    @GetMapping("/{id}/notifications")
    public ResponseEntity<ApiResponse<java.util.List<InvoiceNotification>>> getNotifications(@PathVariable String id, Authentication auth) {
        return ResponseEntity.ok(ApiResponse.success(notificationService.getNotificationsForInvoice(id)));
    }

    @PreAuthorize("@accessControl.hasPermission(null, 'INVOICE_CREATE')")
    @PostMapping("/{id}/notifications/resend")
    public ResponseEntity<ApiResponse<String>> resendNotification(@PathVariable String id, @RequestBody java.util.Map<String, String> body, Authentication auth) {
        String notifId = body.get("notificationId");
        notificationService.resendNotification(notifId);
        return ResponseEntity.ok(ApiResponse.success("Notification queued for resend."));
    }
}
