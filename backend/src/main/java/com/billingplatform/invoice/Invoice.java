package com.billingplatform.invoice;

import jakarta.persistence.*;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.*;
import org.hibernate.annotations.Where;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "invoices")
@Where(clause = "deleted_at IS NULL")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Invoice extends com.billingplatform.common.BaseEntity {

    @Id
    @Column(length = 100)
    private String id;

    @NotBlank(message = "Customer ID is required")
    @Column(name = "customer_id", nullable = false)
    private String customerId;

    @Column(name = "subscription_id")
    private String subscriptionId;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private InvoiceStatus status;

    @NotBlank(message = "Currency is required")
    @Size(max = 10, message = "Currency must not exceed 10 characters")
    @Column(nullable = false, length = 10)
    private String currency;

    @NotNull(message = "Subtotal is required")
    @Column(nullable = false, precision = 15, scale = 4)
    private BigDecimal subtotal;

    @NotNull(message = "Tax Total is required")
    @Column(name = "tax_total", nullable = false, precision = 15, scale = 4)
    private BigDecimal taxTotal;

    @NotNull(message = "Total is required")
    @Column(nullable = false, precision = 15, scale = 4)
    private BigDecimal total;

    @Column(name = "amount_paid", nullable = false, precision = 15, scale = 4)
    private BigDecimal amountPaid;

    @Column(name = "amount_due", nullable = false, precision = 15, scale = 4)
    private BigDecimal amountDue;

    @NotNull(message = "Invoice Date is required")
    @Column(name = "invoice_date", nullable = false)
    private LocalDateTime invoiceDate;

    @Column(name = "due_date")
    private LocalDateTime dueDate;

    @Column(name = "paid_at")
    private LocalDateTime paidAt;

    @Column(name = "gst_number", length = 20)
    private String gstNumber;

    @Column(name = "customer_phone", length = 20)
    private String customerPhone;

    @Column(name = "tax_percentage", precision = 5, scale = 2)
    private BigDecimal taxPercentage;

    @Enumerated(EnumType.STRING)
    @Column(name = "payment_status", columnDefinition = "VARCHAR(50)")
    private PaymentStatus paymentStatus;

    @Valid
    @OneToMany(mappedBy = "invoice", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<InvoiceLineItem> lineItems = new ArrayList<>();



    public enum InvoiceStatus {
        DRAFT, POSTED, PAYMENT_DUE, PAID, NOT_PAID, VOIDED
    }

    public enum PaymentStatus {
        SENT, PAID, OVERDUE
    }

    @PrePersist
    public void onCreate() {
        super.prePersist();
        if (id == null) {
            id = "inv-" + UUID.randomUUID().toString();
        }
        if (invoiceDate == null) {
            invoiceDate = LocalDateTime.now();
        }
        if (status == null) {
            status = InvoiceStatus.DRAFT;
        }
        if (currency == null) {
            currency = "USD";
        }
        if (subtotal == null) subtotal = BigDecimal.ZERO;
        if (taxTotal == null) taxTotal = BigDecimal.ZERO;
        if (total == null) total = BigDecimal.ZERO;
        if (amountPaid == null) amountPaid = BigDecimal.ZERO;
        if (amountDue == null) amountDue = total;
        if (getCreatedAt() == null) {
            setCreatedAt(LocalDateTime.now());
            setUpdatedAt(LocalDateTime.now());
        }
    }

    @PreUpdate
    public void onUpdate() {
        super.preUpdate();
        setUpdatedAt(LocalDateTime.now());
    }

    public BigDecimal getDiscountTotal() {
        if (lineItems == null) {
            return BigDecimal.ZERO;
        }
        return lineItems.stream()
                .map(item -> item.getDiscountAmount() != null ? item.getDiscountAmount() : BigDecimal.ZERO)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }
}
