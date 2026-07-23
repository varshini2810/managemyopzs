package com.billingplatform.controller;

import com.billingplatform.model.*;
import com.billingplatform.repository.*;
import com.billingplatform.dto.*;
import com.billingplatform.security.*;
import com.billingplatform.service.*;
import com.billingplatform.exception.*;
import com.billingplatform.util.*;


import com.billingplatform.model.InvoiceNotification;
import com.billingplatform.service.InvoiceNotificationService;
import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Autowired;
import java.util.List;

@RestController
@RequestMapping("/api/invoicenotifications")
public class InvoiceNotificationController {
    @Autowired
    private InvoiceNotificationService service;

    @GetMapping
    public List<InvoiceNotification> getAll() { return service.findAll(); }
    @PostMapping
    public InvoiceNotification create(@RequestBody InvoiceNotification entity) { return service.save(entity); }
}
