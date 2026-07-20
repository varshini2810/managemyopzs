package com.billingplatform.controller;

import com.billingplatform.model.*;
import com.billingplatform.repository.*;
import com.billingplatform.dto.*;
import com.billingplatform.security.*;
import com.billingplatform.service.*;
import com.billingplatform.exception.*;
import com.billingplatform.util.*;


import com.billingplatform.model.CreditNoteLineItem;
import com.billingplatform.service.CreditNoteLineItemService;
import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Autowired;
import java.util.List;

@RestController
@RequestMapping("/api/creditnotelineitems")
public class CreditNoteLineItemController {
    @Autowired
    private CreditNoteLineItemService service;

    @GetMapping
    public List<CreditNoteLineItem> getAll() { return service.findAll(); }
    @PostMapping
    public CreditNoteLineItem create(@RequestBody CreditNoteLineItem entity) { return service.save(entity); }
}
