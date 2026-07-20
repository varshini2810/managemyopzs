package com.billingplatform.controller;

import com.billingplatform.model.*;
import com.billingplatform.repository.*;
import com.billingplatform.dto.*;
import com.billingplatform.security.*;
import com.billingplatform.service.*;
import com.billingplatform.exception.*;
import com.billingplatform.util.*;


import com.billingplatform.model.Quote;
import com.billingplatform.service.QuoteService;
import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Autowired;
import java.util.List;

@RestController
@RequestMapping("/api/quotes")
public class QuoteController {
    @Autowired
    private QuoteService service;

    @GetMapping
    public List<Quote> getAll() { return service.findAll(); }
    @PostMapping
    public Quote create(@RequestBody Quote entity) { return service.save(entity); }
}
