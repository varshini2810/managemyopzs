package com.billingplatform.dashboard;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface DashboardMetricRepository extends JpaRepository<DashboardMetric, Long> {

    List<DashboardMetric> findByMetricTypeAndMetricDateBetweenOrderByMetricDateAsc(
            String metricType, LocalDate start, LocalDate end);

    @Query("SELECT m FROM DashboardMetric m WHERE m.metricType = :type ORDER BY m.metricDate DESC LIMIT 1")
    java.util.Optional<DashboardMetric> findLatestByType(String type);

    @Query("SELECT m FROM DashboardMetric m WHERE m.metricType = :type ORDER BY m.metricDate DESC LIMIT 2")
    List<DashboardMetric> findLastTwoByType(String type);
}
