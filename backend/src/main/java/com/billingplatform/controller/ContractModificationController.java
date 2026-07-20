package com.billingplatform.controller;

import com.billingplatform.model.*;
import com.billingplatform.repository.*;
import com.billingplatform.dto.*;
import com.billingplatform.security.*;
import com.billingplatform.service.*;
import com.billingplatform.exception.*;
import com.billingplatform.util.*;


import com.billingplatform.model.ContractModification;
import com.billingplatform.service.ContractModificationService;
import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Autowired;
import java.util.List;

@RestController
@RequestMapping("/api/contractmodifications")
public class ContractModificationController {
    @Autowired
    private ContractModificationService service;

    @GetMapping
    public List<ContractModification> getAll() { return service.findAll(); }
    @PostMapping
    public ContractModification create(@RequestBody ContractModification entity) { return service.save(entity); }
}
