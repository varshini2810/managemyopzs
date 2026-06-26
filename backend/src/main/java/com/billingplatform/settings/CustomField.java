package com.billingplatform.settings;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "custom_fields")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class CustomField {

    @Id
    @Column(length = 100)
    private String id;

    @Column(name = "field_name", nullable = false)
    private String fieldName;

    @Column(name = "entity_type", nullable = false)
    private String entityType;

    @Column(name = "field_type", nullable = false)
    private String fieldType;

    @Column(name = "is_required", nullable = false)
    private Boolean isRequired;

    @Column(name = "dropdown_options", columnDefinition = "JSON")
    private String dropdownOptions;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @Column(name = "deleted_at")
    private LocalDateTime deletedAt;

    @PrePersist
    protected void onCreate() {
        if (id == null) {
            id = "cf-" + UUID.randomUUID().toString();
        }
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
        if (isRequired == null) isRequired = false;
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
