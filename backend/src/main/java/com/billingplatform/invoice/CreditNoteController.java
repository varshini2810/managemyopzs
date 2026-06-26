package com.billingplatform.invoice;

import com.billingplatform.auth.CustomUserDetails;
import com.billingplatform.common.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/credit-notes")
@RequiredArgsConstructor
public class CreditNoteController {

    private final CreditNoteService creditNoteService;

    private String getTenantId(Authentication auth) {
        if (auth.getPrincipal() instanceof CustomUserDetails user) {
            return user.getTenantId();
        }
        throw new RuntimeException("Unauthorized");
    }

    @PreAuthorize("@accessControl.hasPermission(null, 'CREDIT_NOTE_VIEW')")
    @GetMapping
    public ResponseEntity<ApiResponse<Page<CreditNote>>> getCreditNotes(
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String customerId,
            @RequestParam(required = false) String search,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            Authentication auth) {
        Page<CreditNote> creditNotes = creditNoteService.getCreditNotes(status, customerId, search, PageRequest.of(page, size));
        return ResponseEntity.ok(ApiResponse.success(creditNotes));
    }

    @PreAuthorize("@accessControl.hasPermission(null, 'CREDIT_NOTE_VIEW')")
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<CreditNote>> getCreditNote(@PathVariable String id, Authentication auth) {
        return ResponseEntity.ok(ApiResponse.success(creditNoteService.getCreditNote(id)));
    }

    @PreAuthorize("@accessControl.hasPermission(null, 'CREDIT_NOTE_CREATE')")
    @PostMapping
    public ResponseEntity<ApiResponse<CreditNote>> createCreditNote(@RequestBody CreditNote creditNote, Authentication auth) {
        String tenantId = getTenantId(auth);
        return ResponseEntity.ok(ApiResponse.success(creditNoteService.createCreditNote(creditNote, tenantId)));
    }

    @PreAuthorize("@accessControl.hasPermission(null, 'CREDIT_NOTE_VOID')")
    @PostMapping("/{id}/void")
    public ResponseEntity<ApiResponse<CreditNote>> voidCreditNote(@PathVariable String id, Authentication auth) {
        return ResponseEntity.ok(ApiResponse.success(creditNoteService.voidCreditNote(id)));
    }
}
