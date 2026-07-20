package com.billingplatform.controller;

import com.billingplatform.model.*;
import com.billingplatform.repository.*;
import com.billingplatform.dto.*;
import com.billingplatform.security.*;
import com.billingplatform.service.*;
import com.billingplatform.exception.*;
import com.billingplatform.util.*;


import com.billingplatform.model.SavedReport;
import com.billingplatform.service.SavedReportService;
import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Autowired;
import java.util.List;

@RestController
@RequestMapping("/api/savedreports")
public class SavedReportController {
    @Autowired
    private SavedReportService service;

    @GetMapping
    public List<SavedReport> getAll() { return service.findAll(); }
    @PostMapping
    public SavedReport create(@RequestBody SavedReport entity) { return service.save(entity); }
}
