package com.billingplatform.model;

import com.billingplatform.model.*;
import com.billingplatform.repository.*;
import com.billingplatform.dto.*;
import com.billingplatform.security.*;
import com.billingplatform.service.*;
import com.billingplatform.exception.*;
import com.billingplatform.util.*;


import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

public class HashTest {
    public static void main(String[] args) {
        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
        System.out.println("Admin@123 -> " + encoder.encode("Admin@123"));
        System.out.println("Super@123 -> " + encoder.encode("Super@123"));
        System.out.println("password -> " + encoder.encode("password"));
        System.out.println("User@123 -> " + encoder.encode("User@123"));
    }
}
