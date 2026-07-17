package com.billingplatform.product;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProductFamilyRepository extends JpaRepository<ProductFamily, String> {
    @Query("SELECT p FROM ProductFamily p WHERE p.deletedAt IS NULL AND (LOWER(p.name) LIKE LOWER(CONCAT('%',:search,'%')) OR LOWER(p.id) LIKE LOWER(CONCAT('%',:search,'%')))")
    Page<ProductFamily> findAllActive(String search, Pageable pageable);

    @Query("SELECT p FROM ProductFamily p WHERE p.deletedAt IS NULL ORDER BY p.createdAt DESC")
    List<ProductFamily> findAllActive();

    Optional<ProductFamily> findByIdAndDeletedAtIsNull(String id);
    boolean existsByIdAndDeletedAtIsNull(String id);
}
