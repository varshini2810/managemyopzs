package com.billingplatform.service;

import com.billingplatform.model.*;
import com.billingplatform.repository.*;
import com.billingplatform.dto.*;
import com.billingplatform.security.*;
import com.billingplatform.service.*;
import com.billingplatform.exception.*;
import com.billingplatform.util.*;


import com.billingplatform.model.PlanCustomFieldValue;
import com.billingplatform.repository.PlanCustomFieldValueRepository;
import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Autowired;
import java.util.List;

@Service
public class PlanCustomFieldValueService {
    @Autowired
    private PlanCustomFieldValueRepository repository;

    public List<PlanCustomFieldValue> findAll() { return repository.findAll(); }
    public PlanCustomFieldValue save(PlanCustomFieldValue entity) { return repository.save(entity); }
}
