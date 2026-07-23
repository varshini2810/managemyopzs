import os

repo_dir = r'c:\Users\Arun\Downloads\managemyopzs-main\managemyopzs-main\backend\src\main\java\com\billingplatform\repository'

methods_to_add = {
    'AddonRepository.java': '''
    @org.springframework.data.jpa.repository.Query("SELECT a FROM Addon a WHERE a.deletedAt IS NULL AND (:status = '' OR a.status = com.billingplatform.model.Addon.Status.active)")
    org.springframework.data.domain.Page<com.billingplatform.model.Addon> findAllActive(@org.springframework.data.repository.query.Param("status") String status, org.springframework.data.domain.Pageable pageable);
    java.util.Optional<com.billingplatform.model.Addon> findByIdAndDeletedAtIsNull(String id);
''',
    'ChargeRepository.java': '''
    @org.springframework.data.jpa.repository.Query("SELECT c FROM Charge c WHERE c.deletedAt IS NULL AND (:status = '' OR c.status = com.billingplatform.model.Charge.Status.active)")
    org.springframework.data.domain.Page<com.billingplatform.model.Charge> findAllActive(@org.springframework.data.repository.query.Param("status") String status, org.springframework.data.domain.Pageable pageable);
    java.util.Optional<com.billingplatform.model.Charge> findByIdAndDeletedAtIsNull(String id);
''',
    'CouponRepository.java': '''
    @org.springframework.data.jpa.repository.Query("SELECT c FROM Coupon c WHERE c.deletedAt IS NULL AND (:status = '' OR c.status = com.billingplatform.model.Coupon.Status.active) AND (LOWER(c.name) LIKE LOWER(CONCAT('%',:search,'%')) OR LOWER(c.id) LIKE LOWER(CONCAT('%',:search,'%')))")
    org.springframework.data.domain.Page<com.billingplatform.model.Coupon> findAllFiltered(@org.springframework.data.repository.query.Param("status") String status, @org.springframework.data.repository.query.Param("search") String search, org.springframework.data.domain.Pageable pageable);
    java.util.Optional<com.billingplatform.model.Coupon> findByIdAndDeletedAtIsNull(String id);
''',
    'PlanPricePointRepository.java': '''
    java.util.List<com.billingplatform.model.PlanPricePoint> findByPlanIdAndDeletedAtIsNull(String planId);
'''
}

for file, methods in methods_to_add.items():
    filepath = os.path.join(repo_dir, file)
    if os.path.exists(filepath):
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
        
        idx = content.rfind('}')
        if idx != -1:
            new_content = content[:idx] + methods + content[idx:]
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(new_content)
            print(f'Added methods to {file}')
