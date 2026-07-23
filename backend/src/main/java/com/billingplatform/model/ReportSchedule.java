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

@Entity
@Table(name = "revenue_report_schedules")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class ReportSchedule extends BaseEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "report_type", nullable = false)
    private String reportType;

    @Column(name = "frequency", nullable = false)
    private String frequency;

    @Column(name = "recipients", columnDefinition = "TEXT", nullable = false)
    private String recipients;
}
