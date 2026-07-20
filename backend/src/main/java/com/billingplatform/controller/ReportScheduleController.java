package com.billingplatform.controller;

import com.billingplatform.model.*;
import com.billingplatform.repository.*;
import com.billingplatform.dto.*;
import com.billingplatform.security.*;
import com.billingplatform.service.*;
import com.billingplatform.exception.*;
import com.billingplatform.util.*;


import com.billingplatform.model.ReportSchedule;
import com.billingplatform.service.ReportScheduleService;
import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Autowired;
import java.util.List;

@RestController
@RequestMapping("/api/reportschedules")
public class ReportScheduleController {
    @Autowired
    private ReportScheduleService service;

    @GetMapping
    public List<ReportSchedule> getAll() { return service.findAll(); }
    @PostMapping
    public ReportSchedule create(@RequestBody ReportSchedule entity) { return service.save(entity); }
}
