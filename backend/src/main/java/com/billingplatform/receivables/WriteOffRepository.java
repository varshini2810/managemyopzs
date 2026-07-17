package com.billingplatform.receivables;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface WriteOffRepository extends JpaRepository<WriteOff, String> {
}
