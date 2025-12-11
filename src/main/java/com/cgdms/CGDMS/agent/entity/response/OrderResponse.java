package com.cgdms.CGDMS.agent.entity.response;

import com.cgdms.CGDMS.agent.entity.Order;
import lombok.Data;
import java.time.LocalDateTime;
import java.util.List;

@Data
public class OrderResponse {
    private Long id;
    private String orderNumber;
//    private AgentResponse agent;
    private String customerName;
    private String customerPhone;
    private String deliveryAddress;
    private Double totalAmount;
    private Double totalCommission;
    private Order.Status status;
    private Long fulfillmentCenterId;
    private LocalDateTime orderDate;
    private LocalDateTime fulfilledDate;
    private List<OrderItemResponse> items;
    private String email;
    private String category;
}