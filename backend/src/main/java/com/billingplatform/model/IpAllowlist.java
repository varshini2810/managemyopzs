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
@Table(name = "security_ip_allowlist")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class IpAllowlist extends BaseEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "ip_range", nullable = false)
    private String ipRange;

    @Column(name = "description")
    private String description;

    @Column(name = "created_by")
    private String createdBy;
}
