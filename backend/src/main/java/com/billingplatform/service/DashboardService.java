package com.billingplatform.service;

import com.billingplatform.model.*;
import com.billingplatform.repository.*;
import com.billingplatform.dto.*;
import com.billingplatform.security.*;
import com.billingplatform.service.*;
import com.billingplatform.exception.*;
import com.billingplatform.util.*;

import com.billingplatform.repository.DashboardMetricRepository;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DashboardService {

    private final DashboardMetricRepository metricRepository;

    private static final List<String> METRIC_TYPES = List.of(
            "mrr", "active_subscriptions", "net_billing", "net_payments", "unpaid_invoices"
    );

    public Map<String, Object> getSummary() {
        Map<String, Object> summary = new LinkedHashMap<>();

        for (String type : METRIC_TYPES) {
            List<DashboardMetric> lastTwo = metricRepository.findLastTwoByType(type);
            BigDecimal current = lastTwo.isEmpty() ? BigDecimal.ZERO : lastTwo.get(0).getMetricValue();
            BigDecimal previous = lastTwo.size() < 2 ? BigDecimal.ZERO : lastTwo.get(1).getMetricValue();

            double changePercent = 0.0;
            if (previous.compareTo(BigDecimal.ZERO) != 0) {
                changePercent = current.subtract(previous)
                        .divide(previous, 4, RoundingMode.HALF_UP)
                        .multiply(BigDecimal.valueOf(100))
                        .doubleValue();
            }

            Map<String, Object> metricData = new LinkedHashMap<>();
            metricData.put("value", current);
            metricData.put("changePercent", Math.round(changePercent * 100.0) / 100.0);
            summary.put(type, metricData);
        }

        return summary;
    }

    public List<Map<String, Object>> getMetrics(String type, String range) {
        LocalDate endDate = LocalDate.now();
        LocalDate startDate;

        switch (range) {
            case "1d" -> startDate = endDate.minusDays(30);
            case "3m" -> startDate = endDate.minusMonths(3);
            case "6m" -> startDate = endDate.minusMonths(6);
            case "12m" -> startDate = endDate.minusMonths(12);
            default -> startDate = endDate.minusMonths(3);
        }

        List<DashboardMetric> metrics = metricRepository
                .findByMetricTypeAndMetricDateBetweenOrderByMetricDateAsc(type, startDate, endDate);

        DateTimeFormatter fmt = DateTimeFormatter.ofPattern("MMM dd");

        return metrics.stream()
                .map(m -> {
                    Map<String, Object> point = new LinkedHashMap<>();
                    point.put("date", m.getMetricDate().format(fmt));
                    point.put("value", m.getMetricValue());
                    return point;
                })
                .collect(Collectors.toList());
    }
}
