package com.billingplatform.model;

import com.billingplatform.model.*;
import com.billingplatform.repository.*;
import com.billingplatform.dto.*;
import com.billingplatform.security.*;
import com.billingplatform.service.*;
import com.billingplatform.exception.*;
import com.billingplatform.util.*;


import com.billingplatform.model.BaseEntity;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.SQLRestriction;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "hsn_sac_cache")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class HsnSacCache extends BaseEntity {

    @Id
    @Column(length = 100)
    private String id;

    @Column(name = "query_text", nullable = false)
    private String queryText;

    @Column(name = "hsn_or_sac_code", length = 50)
    private String hsnOrSacCode;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(name = "gst_rate", precision = 5, scale = 2)
    private BigDecimal gstRate;

    @Column(name = "cached_at", nullable = false)
    private LocalDateTime cachedAt;

    @PrePersist
    protected void onCreate() {
        if (id == null) {
            id = "cache-" + java.util.UUID.randomUUID().toString();
        }
        if (cachedAt == null) {
            cachedAt = LocalDateTime.now();
        }
    }
}
