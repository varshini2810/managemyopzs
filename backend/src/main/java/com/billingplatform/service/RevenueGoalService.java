package com.billingplatform.service;

import com.billingplatform.model.*;
import com.billingplatform.repository.*;
import com.billingplatform.dto.*;
import com.billingplatform.security.*;
import com.billingplatform.service.*;
import com.billingplatform.exception.*;
import com.billingplatform.util.*;


import com.billingplatform.model.RevenueGoal;
import com.billingplatform.repository.RevenueGoalRepository;
import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Autowired;
import java.util.List;

@Service
public class RevenueGoalService {
    @Autowired
    private RevenueGoalRepository repository;

    public List<RevenueGoal> findAll() { return repository.findAll(); }
    public RevenueGoal save(RevenueGoal entity) { return repository.save(entity); }
}
