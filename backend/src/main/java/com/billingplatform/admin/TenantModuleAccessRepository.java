package com.billingplatform.admin;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TenantModuleAccessRepository extends JpaRepository<TenantModuleAccess, String> {
    List<TenantModuleAccess> findByTenantId(String tenantId);
    void deleteByTenantId(String tenantId);
}
