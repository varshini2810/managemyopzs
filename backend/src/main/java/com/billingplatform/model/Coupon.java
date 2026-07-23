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
import java.time.LocalDateTime;

@Entity
@Table(name = "coupons")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Coupon extends BaseEntity {
    @Id @Column(name = "id", length = 100)
    private String id;

    @Column(name = "name", nullable = false)
    private String name;

    @Column(name = "invoice_name")
    private String invoiceName;

    @Enumerated(EnumType.STRING)
    @Column(name = "discount_type", nullable = false)
    private DiscountType discountType;

    @Column(name = "discount_value", nullable = false, precision = 10, scale = 2)
    @Builder.Default
    private BigDecimal discountValue = BigDecimal.ZERO;

    @Enumerated(EnumType.STRING)
    @Column(name = "apply_on", nullable = false)
    @Builder.Default
    private ApplyOn applyOn = ApplyOn.invoice_amount;

    @Column(name = "applicable_item_ids", columnDefinition = "JSON")
    private String applicableItemIds;

    @Enumerated(EnumType.STRING)
    @Column(name = "duration_type", nullable = false)
    @Builder.Default
    private DurationType durationType = DurationType.one_time;

    @Column(name = "duration_value")
    private Integer durationValue;

    @Enumerated(EnumType.STRING)
    @Column(name = "duration_unit")
    private DurationUnit durationUnit;

    @Column(name = "valid_till")
    private LocalDateTime validTill;

    @Column(name = "max_redemptions")
    private Integer maxRedemptions;

    @Column(name = "current_redemptions")
    @Builder.Default
    private Integer currentRedemptions = 0;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    @Builder.Default
    private Status status = Status.active;

    @Column(name = "metadata", columnDefinition = "JSON")
    private String metadata;

    @Column(name = "invoice_note", columnDefinition = "TEXT")
    private String invoiceNote;

    public enum DiscountType { percentage, fixed_amount }
    public enum ApplyOn { invoice_amount, each_specified_item }
    public enum DurationType { one_time, forever, limited_period }
    public enum DurationUnit { days, months }
    public enum Status { active, expired, archived }
}
