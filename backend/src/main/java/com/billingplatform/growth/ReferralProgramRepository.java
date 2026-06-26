package com.billingplatform.growth;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ReferralProgramRepository extends JpaRepository<ReferralProgram, String> {
}
