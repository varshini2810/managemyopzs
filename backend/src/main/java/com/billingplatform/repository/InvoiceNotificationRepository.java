package com.billingplatform.repository;

import com.billingplatform.model.*;
import com.billingplatform.repository.*;
import com.billingplatform.dto.*;
import com.billingplatform.security.*;
import com.billingplatform.service.*;
import com.billingplatform.exception.*;
import com.billingplatform.util.*;


import com.billingplatform.model.*;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface InvoiceNotificationRepository extends JpaRepository<InvoiceNotification, String> {

    List<InvoiceNotification> findByInvoiceIdOrderByScheduledForDesc(String invoiceId);

    @Query("SELECT n FROM InvoiceNotification n WHERE n.status = 'PENDING' AND n.scheduledFor <= :now")
    List<InvoiceNotification> findPendingNotificationsToDispatch(@Param("now") LocalDateTime now);

    @Modifying
    @Query("UPDATE InvoiceNotification n SET n.status = 'CANCELLED' WHERE n.invoice.id = :invoiceId AND n.status = 'PENDING'")
    void cancelPendingForInvoice(@Param("invoiceId") String invoiceId);

    boolean existsByInvoiceIdAndTypeAndStatus(String invoiceId, InvoiceNotification.NotificationType type, InvoiceNotification.Status status);
}
