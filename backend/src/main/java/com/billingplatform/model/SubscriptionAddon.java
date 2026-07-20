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

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "subscription_addons")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class SubscriptionAddon extends com.billingplatform.model.BaseEntity {

    @Id
    @Column(length = 100)
    private String id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "subscription_id", nullable = false)
    @JsonIgnore
    private Subscription subscription;

    @Column(name = "addon_id", nullable = false)
    private String addonId;

    @Column(nullable = false)
    private Integer quantity;

    @Column(name = "unit_price", nullable = false, precision = 15, scale = 4)
    private BigDecimal unitPrice;



    @PrePersist
    public void onCreate() {
        super.prePersist();
        if (id == null) {
            id = "sub_addon-" + UUID.randomUUID().toString();
        }
        if (quantity == null) {
            quantity = 1;
        }
        if (unitPrice == null) {
            unitPrice = BigDecimal.ZERO;
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
