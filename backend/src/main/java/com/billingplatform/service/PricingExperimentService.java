package com.billingplatform.service;

import com.billingplatform.model.*;
import com.billingplatform.repository.*;
import com.billingplatform.dto.*;
import com.billingplatform.security.*;
import com.billingplatform.service.*;
import com.billingplatform.exception.*;
import com.billingplatform.util.*;


import com.billingplatform.model.PricingExperiment;
import com.billingplatform.repository.PricingExperimentRepository;
import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Autowired;
import java.util.List;

@Service
public class PricingExperimentService {
    @Autowired
    private PricingExperimentRepository repository;

    public List<PricingExperiment> findAll() { return repository.findAll(); }
    public PricingExperiment save(PricingExperiment entity) { return repository.save(entity); }
}
