package com.billingplatform.retention;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CancelFlowConfigRepository extends JpaRepository<CancelFlowConfig, String> {
}
