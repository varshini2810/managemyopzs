package com.billingplatform.repository;

import com.billingplatform.model.*;
import com.billingplatform.repository.*;
import com.billingplatform.dto.*;
import com.billingplatform.security.*;
import com.billingplatform.service.*;
import com.billingplatform.exception.*;
import com.billingplatform.util.*;


import com.billingplatform.model.Charge;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ChargeRepository extends JpaRepository<Charge, Long> {

    @org.springframework.data.jpa.repository.Query("SELECT c FROM Charge c WHERE c.deletedAt IS NULL AND (:status = '' OR c.status = com.billingplatform.model.Charge.Status.active)")
    org.springframework.data.domain.Page<com.billingplatform.model.Charge> findAllActive(@org.springframework.data.repository.query.Param("status") String status, org.springframework.data.domain.Pageable pageable);
    java.util.Optional<com.billingplatform.model.Charge> findByIdAndDeletedAtIsNull(String id);
}
