package com.billingplatform.service;

import com.billingplatform.model.*;
import com.billingplatform.repository.*;
import com.billingplatform.dto.*;
import com.billingplatform.security.*;
import com.billingplatform.service.*;
import com.billingplatform.exception.*;
import com.billingplatform.util.*;


import com.billingplatform.model.AddonCustomFieldValue;
import com.billingplatform.repository.AddonCustomFieldValueRepository;
import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Autowired;
import java.util.List;

@Service
public class AddonCustomFieldValueService {
    @Autowired
    private AddonCustomFieldValueRepository repository;

    public List<AddonCustomFieldValue> findAll() { return repository.findAll(); }
    public AddonCustomFieldValue save(AddonCustomFieldValue entity) { return repository.save(entity); }
}
