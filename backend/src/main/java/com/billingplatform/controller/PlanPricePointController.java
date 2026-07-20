package com.billingplatform.controller;

import com.billingplatform.model.*;
import com.billingplatform.repository.*;
import com.billingplatform.dto.*;
import com.billingplatform.security.*;
import com.billingplatform.service.*;
import com.billingplatform.exception.*;
import com.billingplatform.util.*;


import com.billingplatform.model.PlanPricePoint;
import com.billingplatform.service.PlanPricePointService;
import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Autowired;
import java.util.List;

@RestController
@RequestMapping("/api/planpricepoints")
public class PlanPricePointController {
    @Autowired
    private PlanPricePointService service;

    @GetMapping
    public List<PlanPricePoint> getAll() { return service.findAll(); }
    @PostMapping
    public PlanPricePoint create(@RequestBody PlanPricePoint entity) { return service.save(entity); }
}
