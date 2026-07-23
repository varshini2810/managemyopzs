package com.billingplatform.controller;

import com.billingplatform.model.*;
import com.billingplatform.repository.*;
import com.billingplatform.dto.*;
import com.billingplatform.security.*;
import com.billingplatform.service.*;
import com.billingplatform.exception.*;
import com.billingplatform.util.*;


import com.billingplatform.model.Dispute;
import com.billingplatform.service.DisputeService;
import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Autowired;
import java.util.List;

@RestController
@RequestMapping("/api/disputes")
public class DisputeController {
    @Autowired
    private DisputeService service;

    @GetMapping
    public List<Dispute> getAll() { return service.findAll(); }
    @PostMapping
    public Dispute create(@RequestBody Dispute entity) { return service.save(entity); }
}
