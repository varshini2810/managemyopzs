package com.billingplatform.model;

import com.billingplatform.model.*;
import com.billingplatform.repository.*;
import com.billingplatform.dto.*;
import com.billingplatform.security.*;
import com.billingplatform.service.*;
import com.billingplatform.exception.*;
import com.billingplatform.util.*;


import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "dashboard_metrics")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class DashboardMetric {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "metric_type", nullable = false)
    private String metricType;

    @Column(name = "metric_date", nullable = false)
    private LocalDate metricDate;

    @Column(name = "metric_value", nullable = false)
    private BigDecimal metricValue;

    @Column(name = "created_at")
    private LocalDateTime createdAt;
}
