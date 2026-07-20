package com.billingplatform.controller;

import com.billingplatform.model.*;
import com.billingplatform.repository.*;
import com.billingplatform.dto.*;
import com.billingplatform.security.*;
import com.billingplatform.service.*;
import com.billingplatform.exception.*;
import com.billingplatform.util.*;


import com.billingplatform.model.InvoiceLineItem;
import com.billingplatform.service.InvoiceLineItemService;
import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Autowired;
import java.util.List;

@RestController
@RequestMapping("/api/invoicelineitems")
public class InvoiceLineItemController {
    @Autowired
    private InvoiceLineItemService service;

    @GetMapping
    public List<InvoiceLineItem> getAll() { return service.findAll(); }
    @PostMapping
    public InvoiceLineItem create(@RequestBody InvoiceLineItem entity) { return service.save(entity); }
}
