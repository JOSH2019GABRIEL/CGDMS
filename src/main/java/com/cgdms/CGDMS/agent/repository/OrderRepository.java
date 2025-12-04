package com.cgdms.CGDMS.agent.repository;

import com.cgdms.CGDMS.agent.entity.Order;
import com.cgdms.CGDMS.agent.service.mapper.OrderMapperService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {

    Optional<Order> findByOrderNumber(String orderNumber);

//    List<Order> findByAgent_AgentId(Integer agentId);
//
    List<Order> findByStatus(String status);

//    @Query
    List<Order> findByAgentId(Long agentId);

    @Query(value = """
                    SELECT o FROM Order o WHERE o.archived = 0 AND o.farm.id = :farmId
                    """)
    Page<Order> findAllNotArchived(Pageable pageable, Long farmId);

    @Query(value = """
                    SELECT o FROM Order o WHERE o.archived = 0 AND o.farm.id = :farmId AND o.operatorUserId = :id
                    """)
    Page<Order> findAllNotArchivedForUsers(Pageable pageable, Long farmId, Integer id);

    @Query(value = """
                    SELECT o FROM Order o WHERE o.archived = 0 AND o.farm.id = :farmId AND o.status = :status
                    """)
    Page<Order> findAllNotArchivedAndStatus(Pageable pageable, Long farmId, String status);

    @Query(value = """
                    SELECT o FROM Order o WHERE o.archived = 0 AND o.farm.id = :farmId AND o.operatorUserId = :id AND o.status = :status
                    """)
    Page<Order> findAllNotArchivedForUsersAndStatus(Pageable pageable, Long farmId, Integer id, String status);


    @Query(
            value = "SELECT COUNT(*) FROM orders WHERE agent_id = :userId",
            nativeQuery = true
    )
    long countByUserId(@Param("userId") Integer userId);

    @Query(
            value = "SELECT COUNT(*) FROM orders WHERE agent_id = :userId AND status = :status",
            nativeQuery = true
    )
    long countByUserIdAndStatus(@Param("userId") Integer userId, @Param("status") String status);
//
//    List<Order> findByStatusAndAgent_AgentId(String status, Integer agentId);

    // Summary
    @Query(value = """
            SELECT
            COUNT(*) AS totalOrders,
            SUM(oi.quantity) AS totalUnits,
            SUM(o.total_amount) AS totalSales,
            SUM(o.total_commission) AS totalCommission,
            AVG(o.total_amount) AS averageValue
        FROM orders o
        LEFT JOIN order_items oi ON oi.order_id = o.id
    WHERE (:status IS NULL OR o.status = :status)
      AND o.order_date::date BETWEEN :start AND :end
      AND (:agentId IS NULL OR o.agent_id = :agentId)
    """, nativeQuery = true)
    OrderMapperService.SummaryDTO getSummary(
            @Param("agentId") Integer agentId,
            @Param("start") LocalDateTime start,
            @Param("end") LocalDateTime end,
            @Param("status") String status);

    // Top SKUs
    @Query(value = """
    SELECT 
        p.product_name AS sku,
        SUM(oi.quantity) AS totalUnits,
        SUM(oi.quantity * oi.unit_price) AS value
    FROM order_items oi
    JOIN orders o ON o.id = oi.order_id
    JOIN products p ON p.id = oi.product_id
    WHERE (:status IS NULL OR o.status = :status)
      AND o.order_date::date BETWEEN :start AND :end
      AND (:agentId IS NULL OR o.agent_id = :agentId)
    GROUP BY p.product_name
    ORDER BY totalUnits DESC
    LIMIT 10
    """, nativeQuery = true)
    List<OrderMapperService.TopSkuDTO> getTopSkus(
            @Param("agentId") Integer agentId,
            @Param("start") LocalDateTime start,
            @Param("end") LocalDateTime end,
            @Param("status") String status);

    // Paginated Orders
    @Query(value = """
    SELECT 
        o.id AS orderId,
        o.customer_name AS customer,
        o.order_date AS date,
        oi.quantity AS units,
        o.total_amount AS amount,
        o.total_commission AS commission
    FROM orders o
    LEFT JOIN order_items oi ON oi.order_id = o.id
    WHERE (:status IS NULL OR o.status = :status)
      AND o.order_date::date BETWEEN :start AND :end
      AND (:agentId IS NULL OR o.agent_id = :agentId)
    ORDER BY o.order_date DESC
    """,
            countQuery = """
    SELECT COUNT(*)
    FROM orders o
    WHERE (:status IS NULL OR o.status = :status)
      AND o.order_date::date BETWEEN :start AND :end
      AND (:agentId IS NULL OR o.agent_id = :agentId)
    """,
            nativeQuery = true)
    Page<OrderMapperService.OrderTableDTO> getOrders(
            @Param("agentId") Integer agentId,
            @Param("start") LocalDateTime start,
            @Param("end") LocalDateTime end,
            @Param("status") String status,
            Pageable pageable);


    @Query(value = """   
            SELECT SUM(oi.commissionAmount) FROM OrderItem oi WHERE oi.archived = 0 AND oi.operatorUserId = :userId
            """)
    double getAgentCommission(@Param("userId") Integer userId);

    @Query(value = """   
            SELECT SUM(oi.lineTotal) FROM OrderItem oi WHERE oi.archived = 0 AND oi.operatorUserId = :userId
            """)
    double getAgentBuy(@Param("userId") Integer userId);
}