package com.billingplatform.auth;

public class CurrentTenantContext {
    private static final ThreadLocal<String> tenantId = new ThreadLocal<>();
    private static final ThreadLocal<String> userId = new ThreadLocal<>();
    private static final ThreadLocal<Boolean> isPlatformStaff = ThreadLocal.withInitial(() -> false);

    public static void setTenantId(String id) {
        tenantId.set(id);
    }
    public static String getTenantId() {
        return tenantId.get();
    }
    public static void clearTenantId() {
        tenantId.remove();
    }
    
    public static void setUserId(String id) {
        userId.set(id);
    }
    public static String getUserId() {
        return userId.get();
    }
    public static void clearUserId() {
        userId.remove();
    }
    
    public static void setIsPlatformStaff(Boolean isStaff) {
        isPlatformStaff.set(isStaff);
    }
    public static Boolean isPlatformStaff() {
        return isPlatformStaff.get();
    }
    public static void clearIsPlatformStaff() {
        isPlatformStaff.remove();
    }
    
    public static void clear() {
        clearTenantId();
        clearUserId();
        clearIsPlatformStaff();
    }
}
