package com.billingplatform.service;

import com.billingplatform.model.*;
import com.billingplatform.repository.*;
import com.billingplatform.dto.*;
import com.billingplatform.security.*;
import com.billingplatform.service.*;
import com.billingplatform.exception.*;
import com.billingplatform.util.*;


import com.billingplatform.model.RevenueSchedule;
import com.billingplatform.repository.RevenueScheduleRepository;
import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Autowired;
import java.util.List;

@Service
public class RevenueScheduleService {
    @Autowired
    private RevenueScheduleRepository repository;

    public List<RevenueSchedule> findAll() { return repository.findAll(); }
    public RevenueSchedule save(RevenueSchedule entity) { return repository.save(entity); }
}
