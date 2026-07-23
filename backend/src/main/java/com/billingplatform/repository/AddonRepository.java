package com.billingplatform.repository;

import com.billingplatform.model.*;
import com.billingplatform.repository.*;
import com.billingplatform.dto.*;
import com.billingplatform.security.*;
import com.billingplatform.service.*;
import com.billingplatform.exception.*;
import com.billingplatform.util.*;


import com.billingplatform.model.Addon;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AddonRepository extends JpaRepository<Addon, Long> {

    @org.springframework.data.jpa.repository.Query("SELECT a FROM Addon a WHERE a.deletedAt IS NULL AND (:status = '' OR a.status = com.billingplatform.model.Addon.Status.active)")
    org.springframework.data.domain.Page<com.billingplatform.model.Addon> findAllActive(@org.springframework.data.repository.query.Param("status") String status, org.springframework.data.domain.Pageable pageable);
    java.util.Optional<com.billingplatform.model.Addon> findByIdAndDeletedAtIsNull(String id);
}
