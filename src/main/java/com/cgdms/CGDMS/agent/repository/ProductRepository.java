//package com.cgdms.CGDMS.agent.repository;
//
//import com.cgdms.CGDMS.agent.entity.Product;
//import org.springframework.data.jpa.repository.JpaRepository;
//import org.springframework.stereotype.Repository;
//
//import java.util.Optional;
//import java.util.List;
//
//@Repository
//public interface ProductRepository extends JpaRepository<Product, Long> {
//
//    Optional<Product> findBySku(String sku);
//
//    List<Product> findByIsActiveTrue();
//}