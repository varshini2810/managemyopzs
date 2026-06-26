package com.billingplatform.settings;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface AppIntegrationRepository extends JpaRepository<AppIntegration, String> {
    Optional<AppIntegration> findByAppId(String appId);
}
