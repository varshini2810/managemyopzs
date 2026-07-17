package com.billingplatform.customer;

import com.billingplatform.common.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.access.prepost.PreAuthorize;

import java.util.Map;

@RestController
@RequestMapping("/api/customers")
@RequiredArgsConstructor
public class CustomerController {

    private final CustomerService customerService;
    private final CustomerPaymentMethodRepository paymentMethodRepository;
    private final CustomerContactRepository contactRepository;

    @PreAuthorize("@accessControl.hasPermission(null, 'CUSTOMER_VIEW')")
    @GetMapping
    public ResponseEntity<ApiResponse<Page<Customer>>> getCustomers(
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String search,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Page<Customer> customers = customerService.getCustomers(status, search, PageRequest.of(page, size));
        return ResponseEntity.ok(ApiResponse.success(customers));
    }

    @PreAuthorize("@accessControl.hasPermission(null, 'CUSTOMER_VIEW')")
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Customer>> getCustomer(@PathVariable String id) {
        return ResponseEntity.ok(ApiResponse.success(customerService.getCustomer(id)));
    }

    @PreAuthorize("@accessControl.hasPermission(null, 'CUSTOMER_CREATE')")
    @PostMapping
    public ResponseEntity<ApiResponse<Customer>> createCustomer(@RequestBody Customer customer) {
        return ResponseEntity.ok(ApiResponse.success(customerService.createCustomer(customer)));
    }

    @PreAuthorize("@accessControl.hasPermission(null, 'CUSTOMER_EDIT')")
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<Customer>> updateCustomer(@PathVariable String id, @RequestBody Customer customer) {
        return ResponseEntity.ok(ApiResponse.success(customerService.updateCustomer(id, customer)));
    }

    @PreAuthorize("@accessControl.hasPermission(null, 'CUSTOMER_DELETE')")
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteCustomer(@PathVariable String id) {
        customerService.deleteCustomer(id);
        return ResponseEntity.ok(ApiResponse.success(null, "Customer archived successfully"));
    }

    @PreAuthorize("@accessControl.hasPermission(null, 'CUSTOMER_VIEW')")
    @GetMapping("/{id}/payment-methods")
    public ResponseEntity<ApiResponse<Object>> getPaymentMethods(@PathVariable String id) {
        return ResponseEntity.ok(ApiResponse.success(paymentMethodRepository.findByCustomerId(id)));
    }

    @PreAuthorize("@accessControl.hasPermission(null, 'CUSTOMER_CREATE')")
    @PostMapping("/{id}/payment-methods")
    public ResponseEntity<ApiResponse<CustomerPaymentMethod>> addPaymentMethod(@PathVariable String id, @RequestBody CustomerPaymentMethod pm) {
        return ResponseEntity.ok(ApiResponse.success(customerService.addPaymentMethod(id, pm)));
    }

    @PreAuthorize("@accessControl.hasPermission(null, 'CUSTOMER_EDIT')")
    @PutMapping("/{id}/payment-methods/{pmId}/set-primary")
    public ResponseEntity<ApiResponse<Void>> setPrimaryPaymentMethod(@PathVariable String id, @PathVariable String pmId) {
        customerService.setPrimaryPaymentMethod(id, pmId);
        return ResponseEntity.ok(ApiResponse.success(null, "Primary payment method updated"));
    }

    @PreAuthorize("@accessControl.hasPermission(null, 'CUSTOMER_VIEW')")
    @GetMapping("/{id}/contacts")
    public ResponseEntity<ApiResponse<Object>> getContacts(@PathVariable String id) {
        return ResponseEntity.ok(ApiResponse.success(contactRepository.findByCustomerId(id)));
    }

    @PreAuthorize("@accessControl.hasPermission(null, 'CUSTOMER_CREATE')")
    @PostMapping("/{id}/contacts")
    public ResponseEntity<ApiResponse<CustomerContact>> addContact(@PathVariable String id, @RequestBody CustomerContact contact) {
        return ResponseEntity.ok(ApiResponse.success(customerService.addContact(id, contact)));
    }
}
