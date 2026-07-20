package com.billingplatform.repository;

import com.billingplatform.model.*;
import com.billingplatform.repository.*;
import com.billingplatform.dto.*;
import com.billingplatform.security.*;
import com.billingplatform.service.*;
import com.billingplatform.exception.*;
import com.billingplatform.util.*;


import com.billingplatform.model.Coupon;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CouponRepository extends JpaRepository<Coupon, Long> {

    @org.springframework.data.jpa.repository.Query("SELECT c FROM Coupon c WHERE c.deletedAt IS NULL AND (:status = '' OR c.status = com.billingplatform.model.Coupon.Status.active) AND (LOWER(c.name) LIKE LOWER(CONCAT('%',:search,'%')) OR LOWER(c.id) LIKE LOWER(CONCAT('%',:search,'%')))")
    org.springframework.data.domain.Page<com.billingplatform.model.Coupon> findAllFiltered(@org.springframework.data.repository.query.Param("status") String status, @org.springframework.data.repository.query.Param("search") String search, org.springframework.data.domain.Pageable pageable);
    java.util.Optional<com.billingplatform.model.Coupon> findByIdAndDeletedAtIsNull(String id);
}
