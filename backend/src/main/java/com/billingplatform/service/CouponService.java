package com.billingplatform.service;

import com.billingplatform.model.*;
import com.billingplatform.repository.*;
import com.billingplatform.dto.*;
import com.billingplatform.security.*;
import com.billingplatform.service.*;
import com.billingplatform.exception.*;
import com.billingplatform.util.*;


import com.billingplatform.model.Coupon;
import com.billingplatform.repository.CouponRepository;
import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Autowired;
import java.util.List;

@Service
public class CouponService {
    @Autowired
    private CouponRepository repository;

    public List<Coupon> findAll() { return repository.findAll(); }
    public Coupon save(Coupon entity) { return repository.save(entity); }
}
