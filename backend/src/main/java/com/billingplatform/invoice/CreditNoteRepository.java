package com.billingplatform.invoice;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CreditNoteRepository extends JpaRepository<CreditNote, String> {

    @Query("SELECT c FROM CreditNote c WHERE c.deletedAt IS NULL AND " +
           "(:status IS NULL OR c.status = :status) AND " +
           "(:customerId IS NULL OR c.customerId = :customerId) AND " +
           "(:search IS NULL OR c.id LIKE %:search% OR c.customerId IN (" +
           "  SELECT cust.id FROM com.billingplatform.customer.Customer cust WHERE " +
           "  cust.companyName LIKE %:search% OR cust.firstName LIKE %:search% OR cust.lastName LIKE %:search% OR cust.vatNumber LIKE %:search%" +
           "))")
    Page<CreditNote> findAllWithFilters(@Param("status") CreditNote.CreditNoteStatus status, 
                                        @Param("customerId") String customerId,
                                        @Param("search") String search, 
                                        Pageable pageable);

    Optional<CreditNote> findByIdAndDeletedAtIsNull(String id);
}
