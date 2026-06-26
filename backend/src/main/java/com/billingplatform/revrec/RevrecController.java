package com.billingplatform.revrec;

import com.billingplatform.common.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/revrec")
@RequiredArgsConstructor
public class RevrecController {
    @PreAuthorize("@accessControl.hasPermission(null, 'REVREC_VIEW')")
    @GetMapping("/ping")
    public ResponseEntity<ApiResponse<String>> ping() {
        return ResponseEntity.ok(ApiResponse.success("pong"));
    }
}
