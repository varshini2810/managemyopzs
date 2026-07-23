package com.billingplatform.controller;

import com.billingplatform.model.*;
import com.billingplatform.repository.*;
import com.billingplatform.dto.*;
import com.billingplatform.security.*;
import com.billingplatform.service.*;
import com.billingplatform.exception.*;
import com.billingplatform.util.*;


import com.billingplatform.model.PricingExperiment;
import com.billingplatform.service.PricingExperimentService;
import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Autowired;
import java.util.List;

@RestController
@RequestMapping("/api/pricingexperiments")
public class PricingExperimentController {
    @Autowired
    private PricingExperimentService service;

    @GetMapping
    public List<PricingExperiment> getAll() { return service.findAll(); }
    @PostMapping
    public PricingExperiment create(@RequestBody PricingExperiment entity) { return service.save(entity); }
}
