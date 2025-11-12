//package com.cgdms.CGDMS.agent.repository;
//
//import com.cgdms.CGDMS.agent.entity.FulfillmentEvent;
//import org.springframework.data.jpa.repository.JpaRepository;
//import org.springframework.stereotype.Repository;
//
//import java.util.List;
//
//@Repository
//public interface FulfillmentEventRepository extends JpaRepository<FulfillmentEvent, Integer> {
//
//    List<FulfillmentEvent> findByOrder_OrderId(Integer orderId);
//}