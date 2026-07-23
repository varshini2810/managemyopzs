package com.billingplatform.controller;

import com.billingplatform.model.*;
import com.billingplatform.repository.*;
import com.billingplatform.dto.*;
import com.billingplatform.security.*;
import com.billingplatform.service.*;
import com.billingplatform.exception.*;
import com.billingplatform.util.*;


import com.billingplatform.model.DashboardMetric;
import com.billingplatform.service.DashboardMetricService;
import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Autowired;
import java.util.List;

@RestController
@RequestMapping("/api/dashboardmetrics")
public class DashboardMetricController {
    @Autowired
    private DashboardMetricService service;

    @GetMapping
    public List<DashboardMetric> getAll() { return service.findAll(); }
    @PostMapping
    public DashboardMetric create(@RequestBody DashboardMetric entity) { return service.save(entity); }
}
