package com.billingplatform.controller;

import com.billingplatform.model.*;
import com.billingplatform.repository.*;
import com.billingplatform.dto.*;
import com.billingplatform.security.*;
import com.billingplatform.service.*;
import com.billingplatform.exception.*;
import com.billingplatform.util.*;


import com.billingplatform.model.PaymentSource;
import com.billingplatform.service.PaymentSourceService;
import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Autowired;
import java.util.List;

@RestController
@RequestMapping("/api/paymentsources")
public class PaymentSourceController {
    @Autowired
    private PaymentSourceService service;

    @GetMapping
    public List<PaymentSource> getAll() { return service.findAll(); }
    @PostMapping
    public PaymentSource create(@RequestBody PaymentSource entity) { return service.save(entity); }
}
