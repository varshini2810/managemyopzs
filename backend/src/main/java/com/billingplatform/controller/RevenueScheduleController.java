package com.billingplatform.controller;

import com.billingplatform.model.*;
import com.billingplatform.repository.*;
import com.billingplatform.dto.*;
import com.billingplatform.security.*;
import com.billingplatform.service.*;
import com.billingplatform.exception.*;
import com.billingplatform.util.*;


import com.billingplatform.model.RevenueSchedule;
import com.billingplatform.service.RevenueScheduleService;
import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Autowired;
import java.util.List;

@RestController
@RequestMapping("/api/revenueschedules")
public class RevenueScheduleController {
    @Autowired
    private RevenueScheduleService service;

    @GetMapping
    public List<RevenueSchedule> getAll() { return service.findAll(); }
    @PostMapping
    public RevenueSchedule create(@RequestBody RevenueSchedule entity) { return service.save(entity); }
}
