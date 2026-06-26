package com.billingplatform.product;

import com.billingplatform.common.BaseEntity;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "product_families")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class ProductFamily extends BaseEntity {
    @Id @Column(name = "id", length = 100)
    private String id;

    @Column(name = "name", nullable = false)
    private String name;

    @Column(name = "description", columnDefinition = "TEXT")
    private String description;
}
