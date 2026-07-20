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
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "charges")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Charge extends BaseEntity {
    @Id @Column(name = "id", length = 100)
    private String id;

    @Column(name = "name", nullable = false)
    private String name;

    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    @Column(name = "price", nullable = false, precision = 15, scale = 4)
    @Builder.Default
    private BigDecimal price = BigDecimal.ZERO;

    @Column(name = "currency", length = 10)
    @Builder.Default
    private String currency = "USD";

    @Column(name = "taxable")
    @Builder.Default
    private Boolean taxable = false;

    @Enumerated(EnumType.STRING)
    @Column(name = "status") @Builder.Default
    private Status status = Status.active;

    public enum Status { active, archived }
}
