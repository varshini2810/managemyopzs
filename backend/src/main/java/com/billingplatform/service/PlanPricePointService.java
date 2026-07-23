package com.billingplatform.service;

import com.billingplatform.model.*;
import com.billingplatform.repository.*;
import com.billingplatform.dto.*;
import com.billingplatform.security.*;
import com.billingplatform.service.*;
import com.billingplatform.exception.*;
import com.billingplatform.util.*;


import com.billingplatform.model.PlanPricePoint;
import com.billingplatform.repository.PlanPricePointRepository;
import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Autowired;
import java.util.List;

@Service
public class PlanPricePointService {
    @Autowired
    private PlanPricePointRepository repository;

    public List<PlanPricePoint> findAll() { return repository.findAll(); }
    public PlanPricePoint save(PlanPricePoint entity) { return repository.save(entity); }
}
