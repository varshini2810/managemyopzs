package com.billingplatform.service;

import com.billingplatform.model.*;
import com.billingplatform.repository.*;
import com.billingplatform.dto.*;
import com.billingplatform.security.*;
import com.billingplatform.service.*;
import com.billingplatform.exception.*;
import com.billingplatform.util.*;


import com.billingplatform.model.QuoteLineItem;
import com.billingplatform.repository.QuoteLineItemRepository;
import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Autowired;
import java.util.List;

@Service
public class QuoteLineItemService {
    @Autowired
    private QuoteLineItemRepository repository;

    public List<QuoteLineItem> findAll() { return repository.findAll(); }
    public QuoteLineItem save(QuoteLineItem entity) { return repository.save(entity); }
}
