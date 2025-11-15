package com.cgdms.CGDMS.agent.entity.request;

import com.cgdms.CGDMS.agent.entity.Order;
import lombok.Data;
import java.util.List;

@Data
public class OrderRequest {
    private Long id;
    private String orderNumber;
    private Integer agentId;
    private String customerName;
    private String customerPhone;
    private Long fulfillmentCenterId;
    private String deliveryAddress;
    private List<OrderItemRequest> items;
    private Order.Status status;
    private Double totalAmount;
    private String email;

}