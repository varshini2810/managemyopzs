package com.billingplatform.service;

import com.billingplatform.model.*;
import com.billingplatform.repository.*;
import com.billingplatform.dto.*;
import com.billingplatform.security.*;
import com.billingplatform.service.*;
import com.billingplatform.exception.*;
import com.billingplatform.util.*;


import com.billingplatform.model.WriteOff;
import com.billingplatform.repository.WriteOffRepository;
import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Autowired;
import java.util.List;

@Service
public class WriteOffService {
    @Autowired
    private WriteOffRepository repository;

    public List<WriteOff> findAll() { return repository.findAll(); }
    public WriteOff save(WriteOff entity) { return repository.save(entity); }
}
