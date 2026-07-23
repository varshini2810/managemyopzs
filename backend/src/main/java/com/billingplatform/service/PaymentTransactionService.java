package com.billingplatform.service;

import com.billingplatform.model.*;
import com.billingplatform.repository.*;
import com.billingplatform.dto.*;
import com.billingplatform.security.*;
import com.billingplatform.service.*;
import com.billingplatform.exception.*;
import com.billingplatform.util.*;


import com.billingplatform.model.PaymentTransaction;
import com.billingplatform.repository.PaymentTransactionRepository;
import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Autowired;
import java.util.List;

@Service
public class PaymentTransactionService {
    @Autowired
    private PaymentTransactionRepository repository;

    public List<PaymentTransaction> findAll() { return repository.findAll(); }
    public PaymentTransaction save(PaymentTransaction entity) { return repository.save(entity); }
}
