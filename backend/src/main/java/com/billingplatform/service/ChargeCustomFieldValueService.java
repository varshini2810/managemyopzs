package com.billingplatform.service;

import com.billingplatform.model.*;
import com.billingplatform.repository.*;
import com.billingplatform.dto.*;
import com.billingplatform.security.*;
import com.billingplatform.service.*;
import com.billingplatform.exception.*;
import com.billingplatform.util.*;


import com.billingplatform.model.ChargeCustomFieldValue;
import com.billingplatform.repository.ChargeCustomFieldValueRepository;
import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Autowired;
import java.util.List;

@Service
public class ChargeCustomFieldValueService {
    @Autowired
    private ChargeCustomFieldValueRepository repository;

    public List<ChargeCustomFieldValue> findAll() { return repository.findAll(); }
    public ChargeCustomFieldValue save(ChargeCustomFieldValue entity) { return repository.save(entity); }
}
