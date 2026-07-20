package com.billingplatform.controller;

import com.billingplatform.model.*;
import com.billingplatform.repository.*;
import com.billingplatform.dto.*;
import com.billingplatform.security.*;
import com.billingplatform.service.*;
import com.billingplatform.exception.*;
import com.billingplatform.util.*;


import com.billingplatform.model.QuoteApproval;
import com.billingplatform.service.QuoteApprovalService;
import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Autowired;
import java.util.List;

@RestController
@RequestMapping("/api/quoteapprovals")
public class QuoteApprovalController {
    @Autowired
    private QuoteApprovalService service;

    @GetMapping
    public List<QuoteApproval> getAll() { return service.findAll(); }
    @PostMapping
    public QuoteApproval create(@RequestBody QuoteApproval entity) { return service.save(entity); }
}
