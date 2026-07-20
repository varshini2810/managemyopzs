package com.billingplatform.service;

import com.billingplatform.model.*;
import com.billingplatform.repository.*;
import com.billingplatform.dto.*;
import com.billingplatform.security.*;
import com.billingplatform.service.*;
import com.billingplatform.exception.*;
import com.billingplatform.util.*;


import com.billingplatform.model.AccessPreset;
import com.billingplatform.repository.AccessPresetRepository;
import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Autowired;
import java.util.List;

@Service
public class AccessPresetService {
    @Autowired
    private AccessPresetRepository repository;

    public List<AccessPreset> findAll() { return repository.findAll(); }
    public AccessPreset save(AccessPreset entity) { return repository.save(entity); }
}
