package com.billingplatform.controller;

import com.billingplatform.model.*;
import com.billingplatform.repository.*;
import com.billingplatform.dto.*;
import com.billingplatform.security.*;
import com.billingplatform.service.*;
import com.billingplatform.exception.*;
import com.billingplatform.util.*;


import com.billingplatform.model.RevenueGoal;
import com.billingplatform.service.RevenueGoalService;
import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Autowired;
import java.util.List;

@RestController
@RequestMapping("/api/revenuegoals")
public class RevenueGoalController {
    @Autowired
    private RevenueGoalService service;

    @GetMapping
    public List<RevenueGoal> getAll() { return service.findAll(); }
    @PostMapping
    public RevenueGoal create(@RequestBody RevenueGoal entity) { return service.save(entity); }
}
