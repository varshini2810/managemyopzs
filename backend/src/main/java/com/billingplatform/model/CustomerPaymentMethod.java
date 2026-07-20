package com.billingplatform.model;

import com.billingplatform.model.*;
import com.billingplatform.repository.*;
import com.billingplatform.dto.*;
import com.billingplatform.security.*;
import com.billingplatform.service.*;
import com.billingplatform.exception.*;
import com.billingplatform.util.*;


import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "customer_payment_methods")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class CustomerPaymentMethod extends com.billingplatform.model.BaseEntity {

    @Id
    @Column(length = 100)
    private String id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "customer_id", nullable = false)
    @JsonIgnore
    private Customer customer;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private PaymentMethodType type;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private PaymentMethodStatus status;

    @Column(name = "is_primary")
    private boolean isPrimary;

    @Column(name = "is_backup")
    private boolean isBackup;

    @Column(columnDefinition = "JSON")
    private String details;



    public enum PaymentMethodType {
        CARD, BANK_ACCOUNT, PAYPAL
    }

    public enum PaymentMethodStatus {
        VALID, EXPIRED, FAILED
    }

    @PrePersist
    public void onCreate() {
        super.prePersist();
        if (id == null) {
            id = "pm-" + UUID.randomUUID().toString();
        }
        if (status == null) {
            status = PaymentMethodStatus.VALID;
        }
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
