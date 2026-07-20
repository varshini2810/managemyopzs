package com.billingplatform.service;

import com.billingplatform.model.*;
import com.billingplatform.repository.*;
import com.billingplatform.dto.*;
import com.billingplatform.security.*;
import com.billingplatform.service.*;
import com.billingplatform.exception.*;
import com.billingplatform.util.*;


import com.billingplatform.model.DashboardMetric;
import com.billingplatform.repository.DashboardMetricRepository;
import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Autowired;
import java.util.List;

@Service
public class DashboardMetricService {
    @Autowired
    private DashboardMetricRepository repository;

    public List<DashboardMetric> findAll() { return repository.findAll(); }
    public DashboardMetric save(DashboardMetric entity) { return repository.save(entity); }
}
