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
import java.time.LocalDate;

@Entity
@Table(name = "revenue_goals")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class RevenueGoal extends BaseEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "name", nullable = false)
    private String name;

    @Column(name = "target_metric", nullable = false)
    private String targetMetric;

    @Column(name = "target_value", nullable = false)
    private BigDecimal targetValue;

    @Column(name = "start_date")
    private LocalDate startDate;

    @Column(name = "deadline")
    private LocalDate deadline;

    @Column(name = "tracking_frequency")
    private String trackingFrequency;

    @Column(name = "status")
    @Builder.Default
    private String status = "ACTIVE";
}
