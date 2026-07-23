package com.billingplatform.controller;

import com.billingplatform.model.*;
import com.billingplatform.repository.*;
import com.billingplatform.dto.*;
import com.billingplatform.security.*;
import com.billingplatform.service.*;
import com.billingplatform.exception.*;
import com.billingplatform.util.*;


import com.billingplatform.model.JournalEntry;
import com.billingplatform.service.JournalEntryService;
import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Autowired;
import java.util.List;

@RestController
@RequestMapping("/api/journalentrys")
public class JournalEntryController {
    @Autowired
    private JournalEntryService service;

    @GetMapping
    public List<JournalEntry> getAll() { return service.findAll(); }
    @PostMapping
    public JournalEntry create(@RequestBody JournalEntry entity) { return service.save(entity); }
}
