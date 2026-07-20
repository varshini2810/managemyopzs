import os

repo_dir = r'c:\Users\Arun\Downloads\managemyopzs-main\managemyopzs-main\backend\src\main\java\com\billingplatform\repository'

filepath = os.path.join(repo_dir, 'PlanRepository.java')
with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

methods = '''
    @org.springframework.data.jpa.repository.Query("SELECT p FROM Plan p WHERE p.deletedAt IS NULL AND (LOWER(p.internalName) LIKE LOWER(CONCAT('%',:search,'%')) OR LOWER(p.id) LIKE LOWER(CONCAT('%',:search,'%')))")
    org.springframework.data.domain.Page<com.billingplatform.model.Plan> findAllActive(@org.springframework.data.repository.query.Param("search") String search, org.springframework.data.domain.Pageable pageable);
    java.util.Optional<com.billingplatform.model.Plan> findByIdAndDeletedAtIsNull(String id);
'''
if 'findAllActive' not in content:
    idx = content.rfind('}')
    new_content = content[:idx] + methods + content[idx:]
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(new_content)
    print('Added methods to PlanRepository.java')
