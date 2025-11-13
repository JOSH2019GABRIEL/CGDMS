package com.cgdms.CGDMS.agent.repository;

import com.cgdms.CGDMS.agent.entity.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {

    Optional<Order> findByOrderNumber(String orderNumber);

//    List<Order> findByAgent_AgentId(Integer agentId);
//
    List<Order> findByStatus(String status);
//
//    List<Order> findByStatusAndAgent_AgentId(String status, Integer agentId);
}