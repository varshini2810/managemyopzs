package com.billingplatform.controller;

import com.billingplatform.model.*;
import com.billingplatform.repository.*;
import com.billingplatform.dto.*;
import com.billingplatform.security.*;
import com.billingplatform.service.*;
import com.billingplatform.exception.*;
import com.billingplatform.util.*;


import com.billingplatform.model.QuoteLineItem;
import com.billingplatform.service.QuoteLineItemService;
import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Autowired;
import java.util.List;

@RestController
@RequestMapping("/api/quotelineitems")
public class QuoteLineItemController {
    @Autowired
    private QuoteLineItemService service;

    @GetMapping
    public List<QuoteLineItem> getAll() { return service.findAll(); }
    @PostMapping
    public QuoteLineItem create(@RequestBody QuoteLineItem entity) { return service.save(entity); }
}
