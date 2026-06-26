package com.billingplatform.product;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "charge_custom_field_values")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class ChargeCustomFieldValue {

    @Id
    @Column(length = 100)
    private String id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "charge_id", nullable = false)
    @JsonIgnore
    private Charge charge;

    @Column(name = "field_id", nullable = false)
    private String fieldId;

    @Column(name = "field_value")
    private String fieldValue;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        if (id == null) {
            id = "ccf-" + UUID.randomUUID().toString();
        }
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
