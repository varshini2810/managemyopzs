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
@Table(name = "revenue_saved_reports")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class SavedReport extends BaseEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "name", nullable = false)
    private String name;

    @Column(name = "data_source", nullable = false)
    private String dataSource;

    @Column(name = "fields_json", columnDefinition = "TEXT")
    private String fieldsJson;

    @Column(name = "filters_json", columnDefinition = "TEXT")
    private String filtersJson;

    @Column(name = "aggregation_json", columnDefinition = "TEXT")
    private String aggregationJson;

    @Column(name = "visibility")
    @Builder.Default
    private String visibility = "PRIVATE";

    @Column(name = "created_by")
    private String createdBy;
}
