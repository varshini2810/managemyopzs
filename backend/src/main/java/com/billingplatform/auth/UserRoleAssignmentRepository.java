package com.billingplatform.auth;

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
