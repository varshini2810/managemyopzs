package com.billingplatform.payments;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PayoutRepository extends JpaRepository<Payout, String> {
}
