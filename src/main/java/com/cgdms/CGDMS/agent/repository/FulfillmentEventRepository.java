package com.cgdms.CGDMS.agent.repository;

import com.cgdms.CGDMS.agent.entity.FulfillmentEvent;
import com.cgdms.CGDMS.agent.entity.Order;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;


@Repository
public interface FulfillmentEventRepository extends JpaRepository<FulfillmentEvent, Long> {

    @Query(value = """
                    SELECT ff FROM FulfillmentEvent ff WHERE ff.archived = 0 AND ff.farm.id = :farmId
                    """)
    Page<FulfillmentEvent> findAllNotArchived(Pageable pageable, Long farmId);

    @Query(value = """
                    SELECT ff FROM FulfillmentEvent ff WHERE ff.archived = 0 AND ff.farm.id = :farmId AND ff.operatorUserId = :id
                    """)
    Page<FulfillmentEvent> findAllNotArchivedForUsers(Pageable pageable, Long farmId, Integer id);
    @Query(value = """
                    SELECT ff FROM FulfillmentEvent ff WHERE ff.archived = 0 AND ff.farm.id = :farmId AND ff.status = :status
                    """)
    Page<FulfillmentEvent> findAllNotArchivedAndStatus(Pageable pageable, Long farmId, Order.Status status);

    @Query(value = """
                    SELECT ff FROM FulfillmentEvent ff WHERE ff.archived = 0 AND ff.farm.id = :farmId AND ff.operatorUserId = :id AND ff.status = :status
                    """)
    Page<FulfillmentEvent> findAllNotArchivedForUsersAndStatus(Pageable pageable, Long farmId, Integer id, Order.Status status);

//    List<FulfillmentEvent> findByOrder_OrderId(Integer orderId);
}