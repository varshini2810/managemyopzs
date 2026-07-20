package com.billingplatform.service;

import com.billingplatform.model.*;
import com.billingplatform.repository.*;
import com.billingplatform.dto.*;
import com.billingplatform.security.*;
import com.billingplatform.service.*;
import com.billingplatform.exception.*;
import com.billingplatform.util.*;


import com.billingplatform.model.Addon;
import com.billingplatform.repository.AddonRepository;
import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Autowired;
import java.util.List;

@Service
public class AddonService {
    @Autowired
    private AddonRepository repository;

    public List<Addon> findAll() { return repository.findAll(); }
    public Addon save(Addon entity) { return repository.save(entity); }
}
