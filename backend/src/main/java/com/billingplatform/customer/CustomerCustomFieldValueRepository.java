package com.billingplatform.customer;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CustomerCustomFieldValueRepository extends JpaRepository<CustomerCustomFieldValue, String> {
}
