package com.billingplatform.repository;

import com.billingplatform.model.*;
import com.billingplatform.repository.*;
import com.billingplatform.dto.*;
import com.billingplatform.security.*;
import com.billingplatform.service.*;
import com.billingplatform.exception.*;
import com.billingplatform.util.*;


import com.billingplatform.model.Plan;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PlanRepository extends JpaRepository<Plan, Long> {

    @org.springframework.data.jpa.repository.Query("SELECT p FROM Plan p WHERE p.deletedAt IS NULL AND (LOWER(p.internalName) LIKE LOWER(CONCAT('%',:search,'%')) OR LOWER(p.id) LIKE LOWER(CONCAT('%',:search,'%')))")
    org.springframework.data.domain.Page<com.billingplatform.model.Plan> findAllActive(@org.springframework.data.repository.query.Param("search") String search, org.springframework.data.domain.Pageable pageable);
    java.util.Optional<com.billingplatform.model.Plan> findByIdAndDeletedAtIsNull(String id);
}
