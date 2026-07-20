package com.billingplatform.service;

import com.billingplatform.model.*;
import com.billingplatform.repository.*;
import com.billingplatform.dto.*;
import com.billingplatform.security.*;
import com.billingplatform.service.*;
import com.billingplatform.exception.*;
import com.billingplatform.util.*;

import com.billingplatform.model.CustomerContact;
import com.billingplatform.model.CustomerPaymentMethod;
import com.billingplatform.model.Customer;
import com.billingplatform.repository.CustomerContactRepository;
import com.billingplatform.repository.CustomerPaymentMethodRepository;
import com.billingplatform.repository.CustomerRepository;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class CustomerService {

    private final CustomerRepository customerRepository;
    private final CustomerPaymentMethodRepository paymentMethodRepository;
    private final CustomerContactRepository contactRepository;

    @Transactional(readOnly = true)
    public Page<Customer> getCustomers(String status, String search, Pageable pageable) {
        Customer.CustomerStatus customerStatus = (status != null && !status.trim().isEmpty()) ? Customer.CustomerStatus.valueOf(status.toUpperCase()) : null;
        Page<Customer> page = customerRepository.findAllWithFilters(customerStatus, search, pageable);
        page.forEach(c -> {
            org.hibernate.Hibernate.initialize(c.getPaymentMethods());
            org.hibernate.Hibernate.initialize(c.getContacts());
            org.hibernate.Hibernate.initialize(c.getCustomFields());
        });
        return page;
    }

    @Transactional(readOnly = true)
    public Customer getCustomer(String id) {
        Customer customer = customerRepository.findByIdAndDeletedAtIsNull(id)
                .orElseThrow(() -> new RuntimeException("Customer not found"));
        org.hibernate.Hibernate.initialize(customer.getPaymentMethods());
        org.hibernate.Hibernate.initialize(customer.getContacts());
        org.hibernate.Hibernate.initialize(customer.getCustomFields());
        return customer;
    }

    @Transactional
    public Customer createCustomer(Customer customer) {
        return customerRepository.save(customer);
    }

    @Transactional
    public Customer updateCustomer(String id, Customer updates) {
        Customer existing = getCustomer(id);
        existing.setFirstName(updates.getFirstName());
        existing.setLastName(updates.getLastName());
        existing.setEmail(updates.getEmail());
        existing.setCompanyName(updates.getCompanyName());
        existing.setPhone(updates.getPhone());
        
        existing.setBillingLine1(updates.getBillingLine1());
        existing.setBillingLine2(updates.getBillingLine2());
        existing.setBillingCity(updates.getBillingCity());
        existing.setBillingState(updates.getBillingState());
        existing.setBillingZip(updates.getBillingZip());
        existing.setBillingCountry(updates.getBillingCountry());

        existing.setShippingLine1(updates.getShippingLine1());
        existing.setShippingLine2(updates.getShippingLine2());
        existing.setShippingCity(updates.getShippingCity());
        existing.setShippingState(updates.getShippingState());
        existing.setShippingZip(updates.getShippingZip());
        existing.setShippingCountry(updates.getShippingCountry());

        existing.setVatNumber(updates.getVatNumber());
        existing.setTaxExempt(updates.isTaxExempt());
        existing.setValidBusinessNoVat(updates.isValidBusinessNoVat());
        existing.setPreferredLanguage(updates.getPreferredLanguage());
        existing.setPreferredCurrency(updates.getPreferredCurrency());

        return customerRepository.save(existing);
    }

    @Transactional
    public void deleteCustomer(String id) {
        Customer existing = getCustomer(id);
        existing.setDeletedAt(LocalDateTime.now());
        customerRepository.save(existing);
    }

    @Transactional
    public CustomerPaymentMethod addPaymentMethod(String customerId, CustomerPaymentMethod pm) {
        Customer customer = getCustomer(customerId);
        pm.setCustomer(customer);
        List<CustomerPaymentMethod> existingMethods = paymentMethodRepository.findByCustomerId(customerId);
        
        if (existingMethods.isEmpty()) {
            pm.setPrimary(true);
        } else if (pm.isPrimary()) {
            existingMethods.forEach(m -> m.setPrimary(false));
            paymentMethodRepository.saveAll(existingMethods);
        }
        
        return paymentMethodRepository.save(pm);
    }

    @Transactional
    public void setPrimaryPaymentMethod(String customerId, String pmId) {
        List<CustomerPaymentMethod> methods = paymentMethodRepository.findByCustomerId(customerId);
        for (CustomerPaymentMethod m : methods) {
            if (m.getId().equals(pmId)) {
                m.setPrimary(true);
            } else {
                m.setPrimary(false);
            }
        }
        paymentMethodRepository.saveAll(methods);
    }

    @Transactional
    public CustomerContact addContact(String customerId, CustomerContact contact) {
        Customer customer = getCustomer(customerId);
        contact.setCustomer(customer);
        return contactRepository.save(contact);
    }
}
