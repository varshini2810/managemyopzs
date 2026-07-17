package com.billingplatform.auth;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicInteger;

@Component
public class RateLimitFilter extends OncePerRequestFilter {

    private final int MAX_REQUESTS_PER_MINUTE = 100;
    private final ConcurrentHashMap<String, RequestData> requestCounts = new ConcurrentHashMap<>();

    private static class RequestData {
        AtomicInteger count = new AtomicInteger(1);
        long timestamp = System.currentTimeMillis();
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        String clientIp = request.getRemoteAddr();
        long currentTime = System.currentTimeMillis();

        requestCounts.compute(clientIp, (key, requestData) -> {
            if (requestData == null || (currentTime - requestData.timestamp) > 60000) {
                return new RequestData();
            }
            requestData.count.incrementAndGet();
            return requestData;
        });

        RequestData data = requestCounts.get(clientIp);

        if (data != null && data.count.get() > MAX_REQUESTS_PER_MINUTE) {
            response.setStatus(HttpStatus.TOO_MANY_REQUESTS.value());
            response.getWriter().write("Too many requests. Please try again later.");
            return;
        }

        filterChain.doFilter(request, response);
    }
}
