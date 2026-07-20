package com.billingplatform.repository;

import com.billingplatform.model.*;
import com.billingplatform.repository.*;
import com.billingplatform.dto.*;
import com.billingplatform.security.*;
import com.billingplatform.service.*;
import com.billingplatform.exception.*;
import com.billingplatform.util.*;

import com.billingplatform.model.Invoice;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface InvoiceRepository extends JpaRepository<Invoice, String> {

    @Query("SELECT i FROM Invoice i WHERE i.deletedAt IS NULL AND " +
           "(:status IS NULL OR i.status = :status) AND " +
           "(:customerId IS NULL OR i.customerId = :customerId) AND " +
           "(:search IS NULL OR i.id LIKE %:search% OR i.customerId IN (" +
           "  SELECT c.id FROM com.billingplatform.model.Customer c WHERE " +
           "  c.companyName LIKE %:search% OR c.firstName LIKE %:search% OR c.lastName LIKE %:search% OR c.vatNumber LIKE %:search%" +
           "))")
    Page<Invoice> findAllWithFilters(@Param("status") Invoice.InvoiceStatus status, 
                                     @Param("customerId") String customerId,
                                     @Param("search") String search, 
                                     Pageable pageable);

    Optional<Invoice> findByIdAndDeletedAtIsNull(String id);

    java.util.List<Invoice> findByPaymentStatus(Invoice.PaymentStatus paymentStatus);
}
