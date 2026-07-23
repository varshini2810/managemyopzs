package com.billingplatform.service;

import com.billingplatform.model.*;
import com.billingplatform.repository.*;
import com.billingplatform.dto.*;
import com.billingplatform.security.*;
import com.billingplatform.service.*;
import com.billingplatform.exception.*;
import com.billingplatform.util.*;


import com.billingplatform.model.CustomField;
import com.billingplatform.repository.CustomFieldRepository;
import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Autowired;
import java.util.List;

@Service
public class CustomFieldService {
    @Autowired
    private CustomFieldRepository repository;

    public List<CustomField> findAll() { return repository.findAll(); }
    public CustomField save(CustomField entity) { return repository.save(entity); }
}
