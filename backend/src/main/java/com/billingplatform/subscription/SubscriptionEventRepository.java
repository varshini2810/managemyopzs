package com.billingplatform.subscription;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SubscriptionEventRepository extends JpaRepository<SubscriptionEvent, String> {
    List<SubscriptionEvent> findBySubscriptionIdOrderByEventDateDesc(String subscriptionId);
}
