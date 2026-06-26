package com.billingplatform.settings;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CustomFieldRepository extends JpaRepository<CustomField, String> {
    List<CustomField> findByEntityTypeAndDeletedAtIsNull(String entityType);
}
