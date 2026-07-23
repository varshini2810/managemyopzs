package com.billingplatform.repository;

import com.billingplatform.model.*;
import com.billingplatform.repository.*;
import com.billingplatform.dto.*;
import com.billingplatform.security.*;
import com.billingplatform.service.*;
import com.billingplatform.exception.*;
import com.billingplatform.util.*;


import com.billingplatform.model.PlanPricePoint;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PlanPricePointRepository extends JpaRepository<PlanPricePoint, Long> {

    java.util.List<com.billingplatform.model.PlanPricePoint> findByPlanIdAndDeletedAtIsNull(String planId);
}
