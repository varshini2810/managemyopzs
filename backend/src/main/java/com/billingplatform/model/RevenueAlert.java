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

@Entity
@Table(name = "revenue_alerts")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class RevenueAlert extends BaseEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "name", nullable = false)
    private String name;

    @Column(name = "metric", nullable = false)
    private String metric;

    @Column(name = "alert_condition", nullable = false)
    private String condition;

    @Column(name = "notification_method", nullable = false)
    private String notificationMethod;

    @Column(name = "recipients", columnDefinition = "TEXT", nullable = false)
    private String recipients;

    @Column(name = "status")
    @Builder.Default
    private String status = "ACTIVE";

    @Column(name = "last_triggered")
    private LocalDateTime lastTriggered;
}
