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

@Entity
@Table(name = "plan_price_points")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class PlanPricePoint extends BaseEntity {
    @Id @Column(name = "id", length = 100)
    private String id;

    @Column(name = "plan_id", nullable = false, length = 100)
    private String planId;

    @Column(name = "external_name", nullable = false)
    private String externalName;

    @Column(name = "internal_name", nullable = false)
    private String internalName;

    @Enumerated(EnumType.STRING)
    @Column(name = "pricing_model", nullable = false)
    @Builder.Default
    private PricingModel pricingModel = PricingModel.flat_fee;

    @Column(name = "price", nullable = false, precision = 15, scale = 4)
    @Builder.Default
    private BigDecimal price = BigDecimal.ZERO;

    @Column(name = "currency", length = 10)
    @Builder.Default
    private String currency = "USD";

    @Enumerated(EnumType.STRING)
    @Column(name = "billing_cycle", nullable = false)
    @Builder.Default
    private BillingCycle billingCycle = BillingCycle.monthly;

    @Column(name = "has_trial")
    @Builder.Default
    private Boolean hasTrial = false;

    @Column(name = "trial_period_days")
    @Builder.Default
    private Integer trialPeriodDays = 0;

    @Column(name = "display_self_serve")
    @Builder.Default
    private Boolean displaySelfServe = false;

    @Column(name = "display_checkout")
    @Builder.Default
    private Boolean displayCheckout = false;

    @Enumerated(EnumType.STRING)
    @Column(name = "status")
    @Builder.Default
    private Status status = Status.active;

    public enum PricingModel { flat_fee, per_unit, tiered, volume, stairstep, usage_based }
    public enum BillingCycle { monthly, quarterly, semi_annual, annual, custom }
    public enum Status { active, archived }
}
