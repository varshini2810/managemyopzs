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
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "plans")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Plan extends BaseEntity {
    @Id @Column(name = "id", length = 100)
    private String id;

    @Column(name = "deleted_at")
    private LocalDateTime deletedAt;

    @OneToMany(mappedBy = "plan", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<PlanCustomFieldValue> customFieldValues = new ArrayList<>();

    @Column(name = "product_family_id", length = 100)
    private String productFamilyId;

    @Column(name = "internal_name", nullable = false)
    private String internalName;

    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    @Column(name = "display_self_serve")
    @Builder.Default
    private Boolean displaySelfServe = false;

    @Column(name = "display_checkout")
    @Builder.Default
    private Boolean displayCheckout = false;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    @Builder.Default
    private Status status = Status.active;

    public enum Status { active, archived }
}
