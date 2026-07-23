package com.billingplatform.model;

import com.billingplatform.model.*;
import com.billingplatform.repository.*;
import com.billingplatform.dto.*;
import com.billingplatform.security.*;
import com.billingplatform.service.*;
import com.billingplatform.exception.*;
import com.billingplatform.util.*;


import com.billingplatform.model.BaseEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.*;

import org.hibernate.annotations.Filter;

@Entity
@Table(name = "tenants")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Filter(name = "tenantFilter", condition = "id = :tenantId")
public class Tenant extends BaseEntity {

    @Id
    @Column(name = "id", length = 100)
    private String id;

    @Column(name = "name", nullable = false)
    private String name;

    @Column(name = "domain")
    private String domain;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false, columnDefinition = "VARCHAR(50)")
    @Builder.Default
    private Status status = Status.TRIAL;
    
    @Column(name = "is_suspended", nullable = false)
    @Builder.Default
    private boolean isSuspended = false;

    public enum Status {
        ACTIVE, SUSPENDED, TRIAL
    }
}
