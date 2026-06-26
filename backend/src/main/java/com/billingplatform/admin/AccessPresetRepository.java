package com.billingplatform.admin;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AccessPresetRepository extends JpaRepository<AccessPreset, String> {
}
