package com.billingplatform.model;

import com.billingplatform.model.*;
import com.billingplatform.repository.*;
import com.billingplatform.dto.*;
import com.billingplatform.security.*;
import com.billingplatform.service.*;
import com.billingplatform.exception.*;
import com.billingplatform.util.*;


import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;

import org.hibernate.annotations.Filter;
import org.hibernate.annotations.FilterDef;
import org.hibernate.annotations.ParamDef;
import com.billingplatform.model.CurrentTenantContext;

@Getter
@Setter
@MappedSuperclass
@EntityListeners(AuditingEntityListener.class)
@FilterDef(name = "tenantFilter", parameters = @ParamDef(name = "tenantId", type = String.class))
@Filter(name = "tenantFilter", condition = "tenant_id = :tenantId")
public abstract class BaseEntity {

    @CreatedDate
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @LastModifiedDate
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @Column(name = "created_by", length = 100)
    private String createdBy;

    @Column(name = "updated_by", length = 100)
    private String updatedBy;

    @Column(name = "tenant_id", length = 100)
    private String tenantId;

    @Column(name = "deleted_at")
    private LocalDateTime deletedAt;

    public boolean isDeleted() {
        return deletedAt != null;
    }

    public void softDelete() {
        this.deletedAt = LocalDateTime.now();
        this.updatedBy = CurrentTenantContext.getUserId();
    }

    @PrePersist
    public void prePersist() {
        if (this.tenantId == null) {
            String ctxTenantId = CurrentTenantContext.getTenantId();
            if (ctxTenantId == null && !CurrentTenantContext.isPlatformStaff()) {
                throw new SecurityException("Cannot save entity without a tenant context");
            }
            this.tenantId = ctxTenantId;
        }
        if (this.createdBy == null) {
            this.createdBy = CurrentTenantContext.getUserId();
        }
    }

    @PreUpdate
    public void preUpdate() {
        this.updatedBy = CurrentTenantContext.getUserId();
    }
}
