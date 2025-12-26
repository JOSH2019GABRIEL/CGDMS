package com.cgdms.CGDMS.agent.repository;

import com.cgdms.CGDMS.agent.entity.CommissionSchemeRule;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CommissionRuleRepository extends JpaRepository<CommissionSchemeRule, Long> {

    @Query("""
        SELECT r FROM CommissionSchemeRule r 
        WHERE r.product.id = :productId
        AND :qty BETWEEN r.minQty AND r.maxQty AND r.archived = 0
    """)
    Optional<CommissionSchemeRule> findRuleForProductAndQty(Long productId, Integer qty);

//    List<CommissionSchemeRule> findByCommissionScheme_CommissionSchemeId(Integer schemeId);

//    List<CommissionSchemeRule> findByCommissionScheme_CommissionSchemeIdAndProduct_ProductId(Integer schemeId, Integer productId);
}