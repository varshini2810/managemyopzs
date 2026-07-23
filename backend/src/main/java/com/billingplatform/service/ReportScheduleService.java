package com.billingplatform.service;

import com.billingplatform.model.*;
import com.billingplatform.repository.*;
import com.billingplatform.dto.*;
import com.billingplatform.security.*;
import com.billingplatform.service.*;
import com.billingplatform.exception.*;
import com.billingplatform.util.*;


import com.billingplatform.model.ReportSchedule;
import com.billingplatform.repository.ReportScheduleRepository;
import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Autowired;
import java.util.List;

@Service
public class ReportScheduleService {
    @Autowired
    private ReportScheduleRepository repository;

    public List<ReportSchedule> findAll() { return repository.findAll(); }
    public ReportSchedule save(ReportSchedule entity) { return repository.save(entity); }
}
