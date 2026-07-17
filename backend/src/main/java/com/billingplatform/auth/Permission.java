package com.billingplatform.auth;

import com.billingplatform.common.BaseEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.*;

@Entity
@Table(name = "permissions")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Permission extends BaseEntity {

    @Id
    @Column(name = "id", length = 100)
    private String id;

    @Column(name = "permission_key", length = 100, nullable = false, unique = true)
    private String permissionKey;

    @Column(name = "description")
    private String description;
}
