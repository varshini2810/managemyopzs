package com.billingplatform.service;

import com.billingplatform.model.*;
import com.billingplatform.repository.*;
import com.billingplatform.dto.*;
import com.billingplatform.security.*;
import com.billingplatform.service.*;
import com.billingplatform.exception.*;
import com.billingplatform.util.*;


import com.billingplatform.model.UpsellRule;
import com.billingplatform.repository.UpsellRuleRepository;
import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Autowired;
import java.util.List;

@Service
public class UpsellRuleService {
    @Autowired
    private UpsellRuleRepository repository;

    public List<UpsellRule> findAll() { return repository.findAll(); }
    public UpsellRule save(UpsellRule entity) { return repository.save(entity); }
}
