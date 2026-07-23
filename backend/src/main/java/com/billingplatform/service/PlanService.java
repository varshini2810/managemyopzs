package com.billingplatform.service;

import com.billingplatform.model.*;
import com.billingplatform.repository.*;
import com.billingplatform.dto.*;
import com.billingplatform.security.*;
import com.billingplatform.service.*;
import com.billingplatform.exception.*;
import com.billingplatform.util.*;


import com.billingplatform.model.Plan;
import com.billingplatform.repository.PlanRepository;
import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Autowired;
import java.util.List;

@Service
public class PlanService {
    @Autowired
    private PlanRepository repository;

    public List<Plan> findAll() { return repository.findAll(); }
    public Plan save(Plan entity) { return repository.save(entity); }
}
