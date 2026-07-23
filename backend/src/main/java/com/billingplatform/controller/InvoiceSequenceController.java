package com.billingplatform.controller;

import com.billingplatform.model.*;
import com.billingplatform.repository.*;
import com.billingplatform.dto.*;
import com.billingplatform.security.*;
import com.billingplatform.service.*;
import com.billingplatform.exception.*;
import com.billingplatform.util.*;


import com.billingplatform.model.InvoiceSequence;
import com.billingplatform.service.InvoiceSequenceService;
import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Autowired;
import java.util.List;

@RestController
@RequestMapping("/api/invoicesequences")
public class InvoiceSequenceController {
    @Autowired
    private InvoiceSequenceService service;

    @GetMapping
    public List<InvoiceSequence> getAll() { return service.findAll(); }
    @PostMapping
    public InvoiceSequence create(@RequestBody InvoiceSequence entity) { return service.save(entity); }
}
