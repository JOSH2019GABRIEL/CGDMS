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
            value = "SELECT COUNT(*) FROM orders WHERE archived = 0 AND agent_id = :userId",
            nativeQuery = true
    )
    long countByUserId(@Param("userId") Integer userId);

    @Query(
            value = "SELECT COUNT(*) FROM orders WHERE archived = 0 AND agent_id = :userId AND status = :status",
            nativeQuery = true
    )
    long countByUserIdAndStatus(@Param("userId") Integer userId, @Param("status") String status);

    @Query(
            value = "SELECT COUNT(*) FROM orders WHERE archived = 0 AND agent_id = :userId AND status IN :statuses",
            nativeQuery = true)
    long countInStatuses(@Param("userId") Integer userId, @Param("statuses") List<String> statuses);

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
    WHERE status IN (:statuses)
      AND o.order_date::date BETWEEN :start AND :end
      AND o.agent_id IN (:agentIds) AND o.archived = 0
    """, nativeQuery = true)
    OrderMapperService.SummaryDTO getSummary(
            @Param("agentIds") List<Integer> agentIds,
            @Param("start") LocalDateTime start,
            @Param("end") LocalDateTime end,
            @Param("statuses") List<String> statuses);

    // Top SKUs
    @Query(value = """
    SELECT 
        p.product_name AS sku,
        SUM(oi.quantity) AS totalUnits,
        SUM(oi.quantity * oi.unit_price) AS value
    FROM order_items oi
    JOIN orders o ON o.id = oi.order_id
    JOIN products p ON p.id = oi.product_id
    WHERE status IN (:statuses)
      AND o.order_date::date BETWEEN :start AND :end
      AND o.agent_id IN (:agentIds) AND o.archived = 0
    GROUP BY p.product_name
    ORDER BY totalUnits DESC
    """, nativeQuery = true)
    List<OrderMapperService.TopSkuDTO> getTopSkus(
            @Param("agentIds") List<Integer> agentIds,
            @Param("start") LocalDateTime start,
            @Param("end") LocalDateTime end,
            @Param("statuses") List<String> statuses);

    // Paginated Orders
    @Query(
            value = """
        SELECT 
            o.id AS orderId,
            o.customer_name AS customer,
            o.order_date AS date,
            oi.quantity AS units,
            oi.line_total AS amount,
            o.total_commission AS commission
        FROM orders o
        LEFT JOIN order_items oi ON oi.order_id = o.id
        WHERE o.status IN (:statuses)
          AND o.order_date::date BETWEEN :start AND :end
          AND o.agent_id IN (:agentIds) AND o.archived = 0
        ORDER BY o.order_date DESC
        """,
            countQuery = """
        SELECT COUNT(*)
        FROM orders o
        WHERE o.status IN (:statuses)
          AND o.order_date::date BETWEEN :start AND :end
          AND o.agent_id IN (:agentIds) AND o.archived = 0
        """,
            nativeQuery = true
    )
    Page<OrderMapperService.OrderTableDTO> getOrders(
            @Param("agentIds") List<Integer> agentIds,
            @Param("start") LocalDateTime start,
            @Param("end") LocalDateTime end,
            @Param("statuses") List<String> statuses,
            Pageable pageable
    );



    @Query(value = """   
            SELECT SUM(oi.commissionAmount) FROM OrderItem oi LEFT JOIN Order o ON o.id = oi.order.id 
            WHERE oi.archived = 0 AND oi.operatorUserId = :userId
            """)
    double getAgentCommission(@Param("userId") Integer userId);

    @Query(value = """   
            SELECT SUM(oi.lineTotal) FROM OrderItem oi LEFT JOIN Order o ON o.id = oi.order.id 
            WHERE oi.archived = 0 AND o.archived = 0 AND oi.operatorUserId = :userId
            """)
    double getAgentBuy(@Param("userId") Integer userId);

    @Query(value = """
        SELECT COALESCE(SUM(oi.commission_amount), 0) 
        FROM order_items oi
        LEFT JOIN orders o ON o.id = oi.order_id
        WHERE oi.archived = 0 
       AND o.status = 'FULFILLED'
          AND oi.operator_user_id = :userId
          AND EXTRACT(MONTH FROM o.order_date) = EXTRACT(MONTH FROM CURRENT_DATE)
          AND EXTRACT(YEAR FROM o.order_date) = EXTRACT(YEAR FROM CURRENT_DATE)
        """, nativeQuery = true)
    double getCurrentMonthCommission(@Param("userId") Integer userId);

    @Query("""
            SELECT u.id
                FROM User u
                LEFT JOIN Role r ON u.role.id = r.id
                WHERE r.name = 'ROLE_AGENT' AND u.farm.id = :farmId
            """)
    List<Integer> getAllAgentId(Long farmId);
}