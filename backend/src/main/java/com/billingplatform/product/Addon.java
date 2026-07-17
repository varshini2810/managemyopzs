package com.billingplatform.product;

import com.billingplatform.common.BaseEntity;
import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "addons")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Addon extends BaseEntity {
    @Id @Column(name = "id", length = 100)
    private String id;

    @Column(name = "name", nullable = false)
    private String name;

    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    @Column(name = "product_family_id", length = 100)
    private String productFamilyId;

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
    @Column(name = "charge_type", nullable = false)
    @Builder.Default
    private ChargeType chargeType = ChargeType.recurring;

    @Column(name = "display_self_serve") @Builder.Default
    private Boolean displaySelfServe = false;

    @Column(name = "display_checkout") @Builder.Default
    private Boolean displayCheckout = false;

    @Enumerated(EnumType.STRING)
    @Column(name = "status") @Builder.Default
    private Status status = Status.active;

    public enum PricingModel { flat_fee, per_unit, tiered, volume, stairstep, usage_based }
    public enum ChargeType { recurring, one_time }
    public enum Status { active, archived }
}
