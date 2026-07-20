package com.billingplatform.controller;

import com.billingplatform.model.*;
import com.billingplatform.repository.*;
import com.billingplatform.dto.*;
import com.billingplatform.security.*;
import com.billingplatform.service.*;
import com.billingplatform.exception.*;
import com.billingplatform.util.*;


import com.billingplatform.model.PaymentTransaction;
import com.billingplatform.service.PaymentTransactionService;
import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Autowired;
import java.util.List;

@RestController
@RequestMapping("/api/paymenttransactions")
public class PaymentTransactionController {
    @Autowired
    private PaymentTransactionService service;

    @GetMapping
    public List<PaymentTransaction> getAll() { return service.findAll(); }
    @PostMapping
    public PaymentTransaction create(@RequestBody PaymentTransaction entity) { return service.save(entity); }
}
