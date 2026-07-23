package com.billingplatform.controller;

import com.billingplatform.model.*;
import com.billingplatform.repository.*;
import com.billingplatform.dto.*;
import com.billingplatform.security.*;
import com.billingplatform.service.*;
import com.billingplatform.exception.*;
import com.billingplatform.util.*;


import com.billingplatform.model.UpsellRule;
import com.billingplatform.service.UpsellRuleService;
import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Autowired;
import java.util.List;

@RestController
@RequestMapping("/api/upsellrules")
public class UpsellRuleController {
    @Autowired
    private UpsellRuleService service;

    @GetMapping
    public List<UpsellRule> getAll() { return service.findAll(); }
    @PostMapping
    public UpsellRule create(@RequestBody UpsellRule entity) { return service.save(entity); }
}
