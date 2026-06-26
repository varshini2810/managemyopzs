package com.billingplatform.customer;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "customer_contacts")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class CustomerContact extends com.billingplatform.common.BaseEntity {

    @Id
    @Column(length = 100)
    private String id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "customer_id", nullable = false)
    @JsonIgnore
    private Customer customer;

    @Column(name = "first_name")
    private String firstName;

    @Column(name = "last_name")
    private String lastName;

    @Column(name = "email", nullable = false)
    private String email;

    @Column(name = "phone")
    private String phone;

    @Column(name = "tag")
    private String tag;

    @Column(name = "send_account_emails")
    private boolean sendAccountEmails;

    @Column(name = "send_billing_emails")
    private boolean sendBillingEmails;



    @PrePersist
    public void onCreate() {
        super.prePersist();
        if (id == null) {
            id = "ctc-" + UUID.randomUUID().toString();
        }
        if (getCreatedAt() == null) {
            setCreatedAt(LocalDateTime.now());
            setUpdatedAt(LocalDateTime.now());
        }
    }

    @PreUpdate
    public void onUpdate() {
        super.preUpdate();
        setUpdatedAt(LocalDateTime.now());
    }
}
