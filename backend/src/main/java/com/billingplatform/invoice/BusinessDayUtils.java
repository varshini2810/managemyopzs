package com.billingplatform.invoice;

import org.springframework.stereotype.Component;

import java.time.DayOfWeek;
import java.time.LocalDateTime;

@Component
public class BusinessDayUtils {

    public LocalDateTime addBusinessDays(LocalDateTime date, int daysToAdd) {
        LocalDateTime result = date;
        int addedDays = 0;
        while (addedDays < daysToAdd) {
            result = result.plusDays(1);
            if (!(result.getDayOfWeek() == DayOfWeek.SATURDAY || result.getDayOfWeek() == DayOfWeek.SUNDAY)) {
                addedDays++;
            }
        }
        return result;
    }
}
