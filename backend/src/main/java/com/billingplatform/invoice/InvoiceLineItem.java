package com.billingplatform.invoice;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "invoice_line_items")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class InvoiceLineItem extends com.billingplatform.common.BaseEntity {

    @Id
    @Column(length = 100)
    private String id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "invoice_id", nullable = false)
    @JsonIgnore
    private Invoice invoice;

    @NotBlank(message = "Description is required")
    @Column(nullable = false)
    private String description;

    @NotNull(message = "Quantity is required")
    @Column(nullable = false)
    private Integer quantity;

    @NotNull(message = "Unit Amount is required")
    @Column(name = "unit_amount", nullable = false, precision = 15, scale = 4)
    private BigDecimal unitAmount;

    @Column(name = "discount_amount", nullable = false, precision = 15, scale = 4)
    private BigDecimal discountAmount;

    @Column(name = "tax_amount", nullable = false, precision = 15, scale = 4)
    private BigDecimal taxAmount;

    @Column(nullable = false, precision = 15, scale = 4)
    private BigDecimal amount;

    @Column(name = "entity_type")
    private String entityType;

    @Column(name = "entity_id")
    private String entityId;

    @Enumerated(EnumType.STRING)
    @Column(name = "item_type", columnDefinition = "VARCHAR(20)")
    private ItemType itemType;

    @Column(name = "hsn_sac_code", length = 50)
    private String hsnSacCode;

    @Column(name = "item_gst_percentage", precision = 5, scale = 2)
    private BigDecimal itemGstPercentage;



    @PrePersist
    public void onCreate() {
        super.prePersist();
        if (id == null) {
            id = "ili-" + UUID.randomUUID().toString();
        }
        if (quantity == null) quantity = 1;
        if (unitAmount == null) unitAmount = BigDecimal.ZERO;
        if (discountAmount == null) discountAmount = BigDecimal.ZERO;
        if (taxAmount == null) taxAmount = BigDecimal.ZERO;
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

    public enum ItemType {
        PRODUCT, SERVICE
    }
}
