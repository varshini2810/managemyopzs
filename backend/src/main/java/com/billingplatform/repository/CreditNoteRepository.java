package com.billingplatform.repository;

import com.billingplatform.model.*;
import com.billingplatform.repository.*;
import com.billingplatform.dto.*;
import com.billingplatform.security.*;
import com.billingplatform.service.*;
import com.billingplatform.exception.*;
import com.billingplatform.util.*;

import com.billingplatform.model.CreditNote;

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
           "  SELECT cust.id FROM com.billingplatform.model.Customer cust WHERE " +
           "  cust.companyName LIKE %:search% OR cust.firstName LIKE %:search% OR cust.lastName LIKE %:search% OR cust.vatNumber LIKE %:search%" +
           "))")
    Page<CreditNote> findAllWithFilters(@Param("status") CreditNote.CreditNoteStatus status, 
                                        @Param("customerId") String customerId,
                                        @Param("search") String search, 
                                        Pageable pageable);

    Optional<CreditNote> findByIdAndDeletedAtIsNull(String id);
}
