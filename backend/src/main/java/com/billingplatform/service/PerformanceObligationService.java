package com.billingplatform.service;

import com.billingplatform.model.*;
import com.billingplatform.repository.*;
import com.billingplatform.dto.*;
import com.billingplatform.security.*;
import com.billingplatform.service.*;
import com.billingplatform.exception.*;
import com.billingplatform.util.*;


import com.billingplatform.model.PerformanceObligation;
import com.billingplatform.repository.PerformanceObligationRepository;
import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Autowired;
import java.util.List;

@Service
public class PerformanceObligationService {
    @Autowired
    private PerformanceObligationRepository repository;

    public List<PerformanceObligation> findAll() { return repository.findAll(); }
    public PerformanceObligation save(PerformanceObligation entity) { return repository.save(entity); }
}
