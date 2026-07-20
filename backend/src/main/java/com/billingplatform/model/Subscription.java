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

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "subscriptions")
@SQLRestriction("deleted_at IS NULL")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Subscription extends com.billingplatform.model.BaseEntity {

    @Id
    @Column(length = 100)
    private String id;

    @Column(name = "customer_id", nullable = false)
    private String customerId;

    @Column(name = "plan_id", nullable = false)
    private String planId;

    @Column(name = "price_point_id", nullable = false)
    private String pricePointId;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private SubscriptionStatus status;

    @Column(name = "current_term_start")
    private LocalDateTime currentTermStart;

    @Column(name = "current_term_end")
    private LocalDateTime currentTermEnd;

    @Column(name = "next_billing_at")
    private LocalDateTime nextBillingAt;

    @OneToMany(mappedBy = "subscription", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<SubscriptionAddon> addons = new ArrayList<>();

    @OneToMany(mappedBy = "subscription", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<SubscriptionEvent> events = new ArrayList<>();



    public enum SubscriptionStatus {
        FUTURE, IN_TRIAL, ACTIVE, NON_RENEWING, PAUSED, CANCELLED
    }

    @PrePersist
    public void onCreate() {
        super.prePersist();
        if (id == null) {
            id = "sub-" + UUID.randomUUID().toString();
        }
        if (status == null) {
            status = SubscriptionStatus.ACTIVE;
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
