package com.billingplatform.model;

import com.billingplatform.model.*;
import com.billingplatform.repository.*;
import com.billingplatform.dto.*;
import com.billingplatform.security.*;
import com.billingplatform.service.*;
import com.billingplatform.exception.*;
import com.billingplatform.util.*;


import jakarta.persistence.EntityManager;
import lombok.RequiredArgsConstructor;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Before;
import org.hibernate.Filter;
import org.hibernate.Session;
import org.springframework.stereotype.Component;

@Aspect
@Component
@RequiredArgsConstructor
public class TenantFilterAspect {

    private final EntityManager entityManager;

    @Before("execution(* org.springframework.data.repository.Repository+.*(..))")
    public void enableTenantFilter() {
        Session session = entityManager.unwrap(Session.class);
        if (!CurrentTenantContext.isPlatformStaff() && CurrentTenantContext.getTenantId() != null) {
            Filter filter = session.enableFilter("tenantFilter");
            filter.setParameter("tenantId", CurrentTenantContext.getTenantId());
        } else {
            session.disableFilter("tenantFilter");
        }
    }
}
