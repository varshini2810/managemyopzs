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
@Table(name = "opz_notifications")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class OpzNotification extends BaseEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "type", nullable = false)
    private String type;

    @Column(name = "channel", nullable = false)
    private String channel;

    @Column(name = "status")
    @Builder.Default
    private String status = "ENABLED";

    @Column(name = "recipients", columnDefinition = "TEXT")
    private String recipients;

    @Column(name = "template_subject")
    private String templateSubject;

    @Column(name = "template_body", columnDefinition = "TEXT")
    private String templateBody;
}
