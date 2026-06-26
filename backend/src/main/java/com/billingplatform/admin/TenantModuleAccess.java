package com.billingplatform.admin;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "tenant_module_access")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class TenantModuleAccess {
    @Id
    @Column(length = 100)
    private String id;

    @Column(name = "tenant_id", nullable = false)
    private String tenantId;

    @Column(name = "suite_key", nullable = false)
    private String suiteKey;

    @Column(name = "module_key", nullable = false)
    private String moduleKey;

    @Column(nullable = false)
    @Builder.Default
    private Boolean granted = true;

    @Column(name = "granted_by")
    private String grantedBy;

    @Column(name = "granted_at", nullable = false)
    private LocalDateTime grantedAt;

    @PrePersist
    public void onCreate() {
        if (id == null) {
            id = "tma-" + java.util.UUID.randomUUID().toString();
        }
        if (grantedAt == null) {
            grantedAt = LocalDateTime.now();
        }
    }
}
