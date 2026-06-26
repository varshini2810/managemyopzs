package com.billingplatform.customer;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CustomerPaymentMethodRepository extends JpaRepository<CustomerPaymentMethod, String> {
    List<CustomerPaymentMethod> findByCustomerId(String customerId);
}
