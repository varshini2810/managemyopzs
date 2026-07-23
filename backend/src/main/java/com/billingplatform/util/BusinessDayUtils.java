package com.billingplatform.util;

import com.billingplatform.model.*;
import com.billingplatform.repository.*;
import com.billingplatform.dto.*;
import com.billingplatform.security.*;
import com.billingplatform.service.*;
import com.billingplatform.exception.*;
import com.billingplatform.util.*;


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
