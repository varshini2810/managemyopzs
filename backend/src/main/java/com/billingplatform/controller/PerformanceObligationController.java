package com.billingplatform.controller;

import com.billingplatform.model.*;
import com.billingplatform.repository.*;
import com.billingplatform.dto.*;
import com.billingplatform.security.*;
import com.billingplatform.service.*;
import com.billingplatform.exception.*;
import com.billingplatform.util.*;


import com.billingplatform.model.PerformanceObligation;
import com.billingplatform.service.PerformanceObligationService;
import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Autowired;
import java.util.List;

@RestController
@RequestMapping("/api/performanceobligations")
public class PerformanceObligationController {
    @Autowired
    private PerformanceObligationService service;

    @GetMapping
    public List<PerformanceObligation> getAll() { return service.findAll(); }
    @PostMapping
    public PerformanceObligation create(@RequestBody PerformanceObligation entity) { return service.save(entity); }
}
