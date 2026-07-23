package com.billingplatform.repository;

import com.billingplatform.model.*;
import com.billingplatform.repository.*;
import com.billingplatform.dto.*;
import com.billingplatform.security.*;
import com.billingplatform.service.*;
import com.billingplatform.exception.*;
import com.billingplatform.util.*;

import com.billingplatform.model.UserRoleAssignment;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRoleAssignmentRepository extends JpaRepository<UserRoleAssignment, String> {
    List<UserRoleAssignment> findByTenantId(String tenantId);
    List<UserRoleAssignment> findByUserIdAndTenantId(String userId, String tenantId);
    List<UserRoleAssignment> findByUserId(String userId);
}
