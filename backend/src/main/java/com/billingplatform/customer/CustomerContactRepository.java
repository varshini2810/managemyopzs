package com.billingplatform.customer;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CustomerContactRepository extends JpaRepository<CustomerContact, String> {
    List<CustomerContact> findByCustomerId(String customerId);
}
