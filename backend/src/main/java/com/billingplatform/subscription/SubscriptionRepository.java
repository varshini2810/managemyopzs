package com.billingplatform.subscription;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface SubscriptionRepository extends JpaRepository<Subscription, String> {

    @Query("SELECT s FROM Subscription s WHERE s.deletedAt IS NULL AND " +
           "(:status IS NULL OR s.status = :status) AND " +
           "(:customerId IS NULL OR s.customerId = :customerId) AND " +
           "(:search IS NULL OR s.id LIKE %:search%)")
    Page<Subscription> findAllWithFilters(@Param("status") Subscription.SubscriptionStatus status, 
                                          @Param("customerId") String customerId,
                                          @Param("search") String search, 
                                          Pageable pageable);

    Optional<Subscription> findByIdAndDeletedAtIsNull(String id);
}
