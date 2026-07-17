package com.billingplatform.revrec;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RevrecAuditTrailRepository extends JpaRepository<RevrecAuditTrail, String> {
}
