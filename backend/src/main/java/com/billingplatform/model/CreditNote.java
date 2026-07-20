package com.billingplatform.model;

import com.billingplatform.model.*;
import com.billingplatform.repository.*;
import com.billingplatform.dto.*;
import com.billingplatform.security.*;
import com.billingplatform.service.*;
import com.billingplatform.exception.*;
import com.billingplatform.util.*;


import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.SQLRestriction;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "credit_notes")
@SQLRestriction("deleted_at IS NULL")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class CreditNote extends com.billingplatform.model.BaseEntity {

    @Id
    @Column(length = 100)
    private String id;

    @Column(name = "customer_id", nullable = false)
    private String customerId;

    @Column(name = "invoice_id")
    private String invoiceId;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private CreditNoteType type;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private CreditNoteStatus status;

    @Column(nullable = false, length = 10)
    private String currency;

    @Column(nullable = false, precision = 15, scale = 4)
    private BigDecimal total;

    @Column(name = "allocated_amount", nullable = false, precision = 15, scale = 4)
    private BigDecimal allocatedAmount;

    @Column(name = "available_amount", nullable = false, precision = 15, scale = 4)
    private BigDecimal availableAmount;

    @Column(nullable = false)
    private LocalDateTime date;

    @OneToMany(mappedBy = "creditNote", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<CreditNoteLineItem> lineItems = new ArrayList<>();

    @Column(name = "expense_type", length = 50)
    private String expenseType;

    @Column(name = "custom_expense_label", length = 100)
    private String customExpenseLabel;

    @Column(name = "expense_cost", precision = 15, scale = 4)
    private BigDecimal expenseCost;



    public enum CreditNoteType {
        ADJUSTMENT, REFUNDABLE, STORE_CREDIT, EXPENSE
    }

    public enum CreditNoteStatus {
        DRAFT, OPEN, CONSUMED, VOIDED
    }

    @PrePersist
    public void onCreate() {
        super.prePersist();
        if (id == null) {
            id = "cn-" + UUID.randomUUID().toString();
        }
        if (date == null) {
            date = LocalDateTime.now();
        }
        if (type == null) type = CreditNoteType.ADJUSTMENT;
        if (status == null) status = CreditNoteStatus.DRAFT;
        if (currency == null) currency = "USD";
        if (total == null) total = BigDecimal.ZERO;
        if (allocatedAmount == null) allocatedAmount = BigDecimal.ZERO;
        if (availableAmount == null) availableAmount = total;
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
}
