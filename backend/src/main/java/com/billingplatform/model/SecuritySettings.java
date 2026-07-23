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
@Table(name = "security_settings")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SecuritySettings extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "tenant_id", nullable = false, unique = true)
    private String tenantId;

    @Column(name = "min_length")
    @Builder.Default
    private int minLength = 12;

    @Column(name = "complexity")
    @Builder.Default
    private String complexity = "Require Numbers & Symbols";

    @Column(name = "mfa_enabled")
    @Builder.Default
    private boolean mfaEnabled = false;

    @Column(name = "session_timeout")
    @Builder.Default
    private int sessionTimeout = 30;
}
