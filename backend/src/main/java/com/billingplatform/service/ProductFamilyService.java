package com.billingplatform.service;

import com.billingplatform.model.*;
import com.billingplatform.repository.*;
import com.billingplatform.dto.*;
import com.billingplatform.security.*;
import com.billingplatform.service.*;
import com.billingplatform.exception.*;
import com.billingplatform.util.*;


import com.billingplatform.model.ProductFamily;
import com.billingplatform.repository.ProductFamilyRepository;
import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Autowired;
import java.util.List;

@Service
public class ProductFamilyService {
    @Autowired
    private ProductFamilyRepository repository;

    public List<ProductFamily> findAll() { return repository.findAll(); }
    public ProductFamily save(ProductFamily entity) { return repository.save(entity); }
}
