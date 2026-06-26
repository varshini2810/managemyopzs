package com.billingplatform.settings;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "app_integrations")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class AppIntegration {

    @Id
    @Column(length = 100)
    private String id;

    @Column(name = "app_id", nullable = false, unique = true)
    private String appId;

    @Column(name = "app_name", nullable = false)
    private String appName;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private AppCategory category;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private AppStatus status;

    @Column(name = "config_json", columnDefinition = "TEXT")
    private String configJson;

    @Column(name = "connected_at")
    private LocalDateTime connectedAt;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    public enum AppCategory {
        PAYMENT, ACCOUNTING, CRM, TAX
    }

    public enum AppStatus {
        CONNECTED, DISCONNECTED
    }

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
        if (status == null) status = AppStatus.DISCONNECTED;
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
