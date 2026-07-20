package com.billingplatform.service;

import com.billingplatform.model.*;
import com.billingplatform.repository.*;
import com.billingplatform.dto.*;
import com.billingplatform.security.*;
import com.billingplatform.service.*;
import com.billingplatform.exception.*;
import com.billingplatform.util.*;

import com.billingplatform.model.CreditNote;
import com.billingplatform.repository.CreditNoteRepository;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;

@Service
@RequiredArgsConstructor
public class CreditNoteService {

    private final CreditNoteRepository creditNoteRepository;

    public Page<CreditNote> getCreditNotes(String status, String customerId, String search, Pageable pageable) {
        CreditNote.CreditNoteStatus cnStatus = (status != null && !status.trim().isEmpty()) ? CreditNote.CreditNoteStatus.valueOf(status.toUpperCase()) : null;
        return creditNoteRepository.findAllWithFilters(cnStatus, customerId, search, pageable);
    }

    public CreditNote getCreditNote(String id) {
        return creditNoteRepository.findByIdAndDeletedAtIsNull(id)
                .orElseThrow(() -> new RuntimeException("Credit Note not found"));
    }

    @Transactional
    public CreditNote createCreditNote(CreditNote creditNote, String tenantId) {
        creditNote.setTenantId(tenantId);
        creditNote.setStatus(CreditNote.CreditNoteStatus.OPEN);

        BigDecimal total = BigDecimal.ZERO;
        
        if (creditNote.getLineItems() != null) {
            for (CreditNoteLineItem item : creditNote.getLineItems()) {
                item.setCreditNote(creditNote);
                BigDecimal amt = item.getUnitAmount().multiply(new BigDecimal(item.getQuantity()));
                item.setAmount(amt);
                total = total.add(amt);
            }
        }
        
        // Expense Type specific cost directly applied
        if (creditNote.getExpenseType() != null && creditNote.getExpenseCost() != null) {
            total = total.add(creditNote.getExpenseCost());
        }

        creditNote.setTotal(total);
        creditNote.setAllocatedAmount(BigDecimal.ZERO);
        creditNote.setAvailableAmount(total);

        return creditNoteRepository.save(creditNote);
    }

    @Transactional
    public CreditNote voidCreditNote(String id) {
        CreditNote cn = getCreditNote(id);
        cn.setStatus(CreditNote.CreditNoteStatus.VOIDED);
        return creditNoteRepository.save(cn);
    }
}
