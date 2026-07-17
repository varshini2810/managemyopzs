package com.billingplatform.revenuestory;

import com.billingplatform.common.BaseEntity;
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
