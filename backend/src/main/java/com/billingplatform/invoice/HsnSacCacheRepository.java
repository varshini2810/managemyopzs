package com.billingplatform.invoice;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface HsnSacCacheRepository extends JpaRepository<HsnSacCache, String> {
    Optional<HsnSacCache> findByQueryTextAndTenantId(String queryText, String tenantId);
}
