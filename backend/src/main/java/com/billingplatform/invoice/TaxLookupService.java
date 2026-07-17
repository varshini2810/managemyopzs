package com.billingplatform.invoice;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class TaxLookupService {

    private final HsnSacCacheRepository cacheRepository;

    @Transactional
    public HsnSacCache lookupHsn(String queryText, String tenantId) {
        return lookupOrFetch(queryText, tenantId, true);
    }

    @Transactional
    public HsnSacCache lookupSac(String queryText, String tenantId) {
        return lookupOrFetch(queryText, tenantId, false);
    }

    private HsnSacCache lookupOrFetch(String queryText, String tenantId, boolean isHsn) {
        // 1. Check Cache
        return cacheRepository.findByQueryTextAndTenantId(queryText, tenantId)
                .orElseGet(() -> fetchFromExternalApi(queryText, tenantId, isHsn));
    }

    private HsnSacCache fetchFromExternalApi(String queryText, String tenantId, boolean isHsn) {
        // Stub: In reality, make HTTP call to Sandbox API or FastGST.
        // For now, return mock data.
        HsnSacCache cache = new HsnSacCache();
        cache.setQueryText(queryText);
        cache.setTenantId(tenantId);
        
        if (isHsn) {
            cache.setHsnOrSacCode("8471" + (int)(Math.random() * 1000));
            cache.setDescription("Auto-processed HSN for: " + queryText);
        } else {
            cache.setHsnOrSacCode("9983" + (int)(Math.random() * 100));
            cache.setDescription("Auto-processed SAC for: " + queryText);
        }

        // Random GST rate from valid slabs: 5%, 12%, 18%
        BigDecimal[] rates = {new BigDecimal("5.00"), new BigDecimal("12.00"), new BigDecimal("18.00")};
        cache.setGstRate(rates[(int)(Math.random() * rates.length)]);
        cache.setCachedAt(LocalDateTime.now());

        return cacheRepository.save(cache);
    }
}
