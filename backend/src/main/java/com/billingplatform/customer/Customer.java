package com.billingplatform.customer;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.Where;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "customers")
@Where(clause = "deleted_at IS NULL")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Customer extends com.billingplatform.common.BaseEntity {

    @Id
    @Column(length = 100)
    private String id;

    @Column(name = "first_name")
    private String firstName;

    @Column(name = "last_name")
    private String lastName;

    @Column(name = "email")
    private String email;

    @Column(name = "company_name")
    private String companyName;

    @Column(name = "phone")
    private String phone;

    // Billing Address
    @Column(name = "billing_line1")
    private String billingLine1;
    @Column(name = "billing_line2")
    private String billingLine2;
    @Column(name = "billing_city")
    private String billingCity;
    @Column(name = "billing_state")
    private String billingState;
    @Column(name = "billing_zip")
    private String billingZip;
    @Column(name = "billing_country")
    private String billingCountry;

    // Shipping Address
    @Column(name = "shipping_line1")
    private String shippingLine1;
    @Column(name = "shipping_line2")
    private String shippingLine2;
    @Column(name = "shipping_city")
    private String shippingCity;
    @Column(name = "shipping_state")
    private String shippingState;
    @Column(name = "shipping_zip")
    private String shippingZip;
    @Column(name = "shipping_country")
    private String shippingCountry;

    @Column(name = "vat_number")
    private String vatNumber;

    @Column(name = "tax_exempt")
    private boolean taxExempt;

    @Column(name = "valid_business_no_vat")
    private boolean validBusinessNoVat;

    @Column(name = "preferred_language")
    private String preferredLanguage;

    @Column(name = "preferred_currency")
    private String preferredCurrency;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private CustomerStatus status;

    @OneToMany(mappedBy = "customer", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<CustomerPaymentMethod> paymentMethods = new ArrayList<>();

    @OneToMany(mappedBy = "customer", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<CustomerContact> contacts = new ArrayList<>();

    @OneToMany(mappedBy = "customer", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<CustomerCustomFieldValue> customFields = new ArrayList<>();



    public enum CustomerStatus {
        ACTIVE, ARCHIVED
    }

    @PrePersist
    public void onCreate() {
        super.prePersist();
        if (id == null) {
            id = "cus-" + UUID.randomUUID().toString();
        }
        if (status == null) {
            status = CustomerStatus.ACTIVE;
        }
        if (preferredCurrency == null) {
            preferredCurrency = "USD";
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
