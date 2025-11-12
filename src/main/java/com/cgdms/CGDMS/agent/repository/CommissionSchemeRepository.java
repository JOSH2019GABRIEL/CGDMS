//package com.cgdms.CGDMS.agent.repository;
//
//import com.cgdms.CGDMS.agent.entity.CommissionScheme;
//import org.springframework.data.jpa.repository.JpaRepository;
//import org.springframework.stereotype.Repository;
//
//import java.util.Optional;
//import java.util.List;
//
//@Repository
//public interface CommissionSchemeRepository extends JpaRepository<CommissionScheme, Integer> {
//
//    Optional<CommissionScheme> findBySchemeName(String schemeName);
//
//    List<CommissionScheme> findByIsActiveTrue();
//}