package com.billingplatform.repository;

import com.billingplatform.model.*;
import com.billingplatform.repository.*;
import com.billingplatform.dto.*;
import com.billingplatform.security.*;
import com.billingplatform.service.*;
import com.billingplatform.exception.*;
import com.billingplatform.util.*;

import com.billingplatform.model.TenantModuleAccess;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TenantModuleAccessRepository extends JpaRepository<TenantModuleAccess, String> {
    List<TenantModuleAccess> findByTenantId(String tenantId);
    void deleteByTenantId(String tenantId);
}
