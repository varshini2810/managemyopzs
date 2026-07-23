package com.billingplatform.repository;

import com.billingplatform.model.*;
import com.billingplatform.repository.*;
import com.billingplatform.dto.*;
import com.billingplatform.security.*;
import com.billingplatform.service.*;
import com.billingplatform.exception.*;
import com.billingplatform.util.*;

import com.billingplatform.model.Customer;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CustomerRepository extends JpaRepository<Customer, String> {

    @Query("SELECT c FROM Customer c WHERE c.deletedAt IS NULL AND " +
           "(:status IS NULL OR c.status = :status) AND " +
           "(:search IS NULL OR c.firstName LIKE %:search% OR c.lastName LIKE %:search% OR c.email LIKE %:search% OR c.id LIKE %:search% OR c.companyName LIKE %:search% OR c.vatNumber LIKE %:search%)")
    Page<Customer> findAllWithFilters(@Param("status") Customer.CustomerStatus status, 
                                      @Param("search") String search, 
                                      Pageable pageable);

    Optional<Customer> findByIdAndDeletedAtIsNull(String id);
}
