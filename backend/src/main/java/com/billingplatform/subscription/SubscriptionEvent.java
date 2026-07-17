package com.billingplatform.subscription;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "subscription_events")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class SubscriptionEvent extends com.billingplatform.common.BaseEntity {

    @Id
    @Column(length = 100)
    private String id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "subscription_id", nullable = false)
    @JsonIgnore
    private Subscription subscription;

    @Column(name = "event_type", nullable = false)
    private String eventType;

    @Column(name = "event_date", nullable = false, updatable = false)
    private LocalDateTime eventDate;

    @Column(columnDefinition = "JSON")
    private String details;

    @PrePersist
    public void onCreate() {
        super.prePersist();
        if (id == null) {
            id = "evt-" + UUID.randomUUID().toString();
        }
        if (eventDate == null) {
            eventDate = LocalDateTime.now();
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
