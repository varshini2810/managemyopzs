package com.billingplatform.invoice;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "credit_note_line_items")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class CreditNoteLineItem extends com.billingplatform.common.BaseEntity {

    @Id
    @Column(length = 100)
    private String id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "credit_note_id", nullable = false)
    @JsonIgnore
    private CreditNote creditNote;

    @Column(nullable = false)
    private String description;

    @Column(nullable = false)
    private Integer quantity;

    @Column(name = "unit_amount", nullable = false, precision = 15, scale = 4)
    private BigDecimal unitAmount;

    @Column(nullable = false, precision = 15, scale = 4)
    private BigDecimal amount;



    @PrePersist
    public void onCreate() {
        super.prePersist();
        if (id == null) {
            id = "cnli-" + UUID.randomUUID().toString();
        }
        if (quantity == null) quantity = 1;
        if (unitAmount == null) unitAmount = BigDecimal.ZERO;
        if (amount == null) amount = BigDecimal.ZERO;
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
