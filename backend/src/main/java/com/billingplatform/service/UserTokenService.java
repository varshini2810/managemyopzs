package com.billingplatform.service;

import com.billingplatform.model.*;
import com.billingplatform.repository.*;
import com.billingplatform.dto.*;
import com.billingplatform.security.*;
import com.billingplatform.service.*;
import com.billingplatform.exception.*;
import com.billingplatform.util.*;


import com.billingplatform.model.UserToken;
import com.billingplatform.repository.UserTokenRepository;
import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Autowired;
import java.util.List;

@Service
public class UserTokenService {
    @Autowired
    private UserTokenRepository repository;

    public List<UserToken> findAll() { return repository.findAll(); }
    public UserToken save(UserToken entity) { return repository.save(entity); }
}
