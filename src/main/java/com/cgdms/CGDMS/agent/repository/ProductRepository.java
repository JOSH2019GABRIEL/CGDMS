package com.cgdms.CGDMS.agent.repository;

import com.cgdms.CGDMS.agent.entity.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.List;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {

    Optional<Product> findBySku(String sku);

    List<Product> findByIsActiveTrue();

    @Query(value = """
                    SELECT p FROM Product p WHERE p.archived = 0 AND p.farm.id = :farmId
                    """)
    Page<Product> findAllNotArchived(Pageable pageable, Long farmId);

    @Query(value = """
                    SELECT p FROM Product p WHERE p.archived = 0 AND p.farm.id = :farmId AND p.operatorUserId = :id
                    """)
    Page<Product> findAllNotArchivedForUsers(Pageable pageable, Long farmId, Integer id);
}