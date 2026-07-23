package com.billingplatform.repository;

import com.billingplatform.model.*;
import com.billingplatform.repository.*;
import com.billingplatform.dto.*;
import com.billingplatform.security.*;
import com.billingplatform.service.*;
import com.billingplatform.exception.*;
import com.billingplatform.util.*;

import com.billingplatform.model.InvoiceSequence;

import jakarta.persistence.LockModeType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface InvoiceSequenceRepository extends JpaRepository<InvoiceSequence, InvoiceSequence.InvoiceSequenceId> {

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("SELECT seq FROM InvoiceSequence seq WHERE seq.tenantId = :tenantId AND seq.year = :year")
    Optional<InvoiceSequence> findByTenantIdAndYearWithLock(@Param("tenantId") String tenantId, @Param("year") int year);

    @org.springframework.data.jpa.repository.Modifying
    @Query(value = "INSERT INTO invoice_number_sequences (tenant_id, year, last_sequence) " +
                   "VALUES (:tenantId, :year, 1) " +
                   "ON DUPLICATE KEY UPDATE last_sequence = last_sequence + 1", nativeQuery = true)
    void incrementSequence(@Param("tenantId") String tenantId, @Param("year") int year);

    @Query(value = "SELECT last_sequence FROM invoice_number_sequences " +
                   "WHERE tenant_id = :tenantId AND year = :year", nativeQuery = true)
    int getLastSequence(@Param("tenantId") String tenantId, @Param("year") int year);
}
