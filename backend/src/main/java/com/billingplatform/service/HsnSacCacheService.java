package com.billingplatform.service;

import com.billingplatform.model.*;
import com.billingplatform.repository.*;
import com.billingplatform.dto.*;
import com.billingplatform.security.*;
import com.billingplatform.service.*;
import com.billingplatform.exception.*;
import com.billingplatform.util.*;


import com.billingplatform.model.HsnSacCache;
import com.billingplatform.repository.HsnSacCacheRepository;
import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Autowired;
import java.util.List;

@Service
public class HsnSacCacheService {
    @Autowired
    private HsnSacCacheRepository repository;

    public List<HsnSacCache> findAll() { return repository.findAll(); }
    public HsnSacCache save(HsnSacCache entity) { return repository.save(entity); }
}
