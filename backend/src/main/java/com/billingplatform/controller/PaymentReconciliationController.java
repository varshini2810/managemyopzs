package com.billingplatform.controller;

import com.billingplatform.model.*;
import com.billingplatform.repository.*;
import com.billingplatform.dto.*;
import com.billingplatform.security.*;
import com.billingplatform.service.*;
import com.billingplatform.exception.*;
import com.billingplatform.util.*;


import com.billingplatform.model.PaymentReconciliation;
import com.billingplatform.service.PaymentReconciliationService;
import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Autowired;
import java.util.List;

@RestController
@RequestMapping("/api/paymentreconciliations")
public class PaymentReconciliationController {
    @Autowired
    private PaymentReconciliationService service;

    @GetMapping
    public List<PaymentReconciliation> getAll() { return service.findAll(); }
    @PostMapping
    public PaymentReconciliation create(@RequestBody PaymentReconciliation entity) { return service.save(entity); }
}
