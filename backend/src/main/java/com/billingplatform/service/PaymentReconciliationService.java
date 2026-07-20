package com.billingplatform.service;

import com.billingplatform.model.*;
import com.billingplatform.repository.*;
import com.billingplatform.dto.*;
import com.billingplatform.security.*;
import com.billingplatform.service.*;
import com.billingplatform.exception.*;
import com.billingplatform.util.*;


import com.billingplatform.model.PaymentReconciliation;
import com.billingplatform.repository.PaymentReconciliationRepository;
import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Autowired;
import java.util.List;

@Service
public class PaymentReconciliationService {
    @Autowired
    private PaymentReconciliationRepository repository;

    public List<PaymentReconciliation> findAll() { return repository.findAll(); }
    public PaymentReconciliation save(PaymentReconciliation entity) { return repository.save(entity); }
}
