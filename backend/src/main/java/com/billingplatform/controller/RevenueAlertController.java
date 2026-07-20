package com.billingplatform.controller;

import com.billingplatform.model.*;
import com.billingplatform.repository.*;
import com.billingplatform.dto.*;
import com.billingplatform.security.*;
import com.billingplatform.service.*;
import com.billingplatform.exception.*;
import com.billingplatform.util.*;


import com.billingplatform.model.RevenueAlert;
import com.billingplatform.service.RevenueAlertService;
import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Autowired;
import java.util.List;

@RestController
@RequestMapping("/api/revenuealerts")
public class RevenueAlertController {
    @Autowired
    private RevenueAlertService service;

    @GetMapping
    public List<RevenueAlert> getAll() { return service.findAll(); }
    @PostMapping
    public RevenueAlert create(@RequestBody RevenueAlert entity) { return service.save(entity); }
}
