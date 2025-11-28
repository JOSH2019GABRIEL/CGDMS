package com.cgdms.CGDMS.agent.repository;

import com.cgdms.CGDMS.agent.entity.Order;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

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
}