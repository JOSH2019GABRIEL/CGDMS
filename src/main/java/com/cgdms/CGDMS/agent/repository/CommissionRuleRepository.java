//package com.cgdms.CGDMS.agent.repository;
//
//import com.cgdms.CGDMS.agent.entity.CommissionSchemeRule;
//import org.springframework.data.jpa.repository.JpaRepository;
//import org.springframework.stereotype.Repository;
//
//import java.util.List;
//
//@Repository
//public interface CommissionRuleRepository extends JpaRepository<CommissionSchemeRule, Integer> {
//
//    List<CommissionSchemeRule> findByCommissionScheme_CommissionSchemeId(Integer schemeId);
//
//    List<CommissionSchemeRule> findByCommissionScheme_CommissionSchemeIdAndProduct_ProductId(Integer schemeId, Integer productId);
//}