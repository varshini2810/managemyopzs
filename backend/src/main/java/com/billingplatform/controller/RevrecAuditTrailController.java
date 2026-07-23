package com.billingplatform.controller;

import com.billingplatform.model.*;
import com.billingplatform.repository.*;
import com.billingplatform.dto.*;
import com.billingplatform.security.*;
import com.billingplatform.service.*;
import com.billingplatform.exception.*;
import com.billingplatform.util.*;


import com.billingplatform.model.RevrecAuditTrail;
import com.billingplatform.service.RevrecAuditTrailService;
import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Autowired;
import java.util.List;

@RestController
@RequestMapping("/api/revrecaudittrails")
public class RevrecAuditTrailController {
    @Autowired
    private RevrecAuditTrailService service;

    @GetMapping
    public List<RevrecAuditTrail> getAll() { return service.findAll(); }
    @PostMapping
    public RevrecAuditTrail create(@RequestBody RevrecAuditTrail entity) { return service.save(entity); }
}
