package com.billingplatform.cpq;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface QuoteLineItemRepository extends JpaRepository<QuoteLineItem, String> {
}
