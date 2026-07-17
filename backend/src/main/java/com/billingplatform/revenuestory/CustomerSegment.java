package com.billingplatform.revenuestory;

import com.billingplatform.common.BaseEntity;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "revenue_customer_segments")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class CustomerSegment extends BaseEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "name", nullable = false)
    private String name;

    @Column(name = "rules_json", columnDefinition = "TEXT", nullable = false)
    private String rulesJson;

    @Column(name = "created_by")
    private String createdBy;
}
