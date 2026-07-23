package com.billingplatform.controller;

import com.billingplatform.model.*;
import com.billingplatform.repository.*;
import com.billingplatform.dto.*;
import com.billingplatform.security.*;
import com.billingplatform.service.*;
import com.billingplatform.exception.*;
import com.billingplatform.util.*;


import com.billingplatform.model.Payout;
import com.billingplatform.service.PayoutService;
import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Autowired;
import java.util.List;

@RestController
@RequestMapping("/api/payouts")
public class PayoutController {
    @Autowired
    private PayoutService service;

    @GetMapping
    public List<Payout> getAll() { return service.findAll(); }
    @PostMapping
    public Payout create(@RequestBody Payout entity) { return service.save(entity); }
}
