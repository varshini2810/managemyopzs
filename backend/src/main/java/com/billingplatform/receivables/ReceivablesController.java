package com.billingplatform.receivables;

import com.billingplatform.common.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/receivables")
@RequiredArgsConstructor
public class ReceivablesController {
    @PreAuthorize("@accessControl.hasPermission(null, 'RECEIVABLES_VIEW')")
    @GetMapping("/ping")
    public ResponseEntity<ApiResponse<String>> ping() {
        return ResponseEntity.ok(ApiResponse.success("pong"));
    }
}
