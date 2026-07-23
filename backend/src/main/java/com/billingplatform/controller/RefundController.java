package com.billingplatform.controller;

import com.billingplatform.model.*;
import com.billingplatform.repository.*;
import com.billingplatform.dto.*;
import com.billingplatform.security.*;
import com.billingplatform.service.*;
import com.billingplatform.exception.*;
import com.billingplatform.util.*;


import com.billingplatform.model.Refund;
import com.billingplatform.service.RefundService;
import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Autowired;
import java.util.List;

@RestController
@RequestMapping("/api/refunds")
public class RefundController {
    @Autowired
    private RefundService service;

    @GetMapping
    public List<Refund> getAll() { return service.findAll(); }
    @PostMapping
    public Refund create(@RequestBody Refund entity) { return service.save(entity); }
}
