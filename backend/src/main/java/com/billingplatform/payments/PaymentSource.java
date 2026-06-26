package com.billingplatform.payments;

import com.billingplatform.common.BaseEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.*;

import java.util.UUID;

@Entity
@Table(name = "payment_sources")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PaymentSource extends BaseEntity {
    @Id
    @Column(name = "id", length = 100)
    @Builder.Default
    private String id = UUID.randomUUID().toString();
}
