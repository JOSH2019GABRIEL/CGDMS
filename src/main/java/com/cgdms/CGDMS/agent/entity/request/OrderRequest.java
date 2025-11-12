package com.cgdms.CGDMS.agent.entity.request;

import lombok.Data;
import java.util.List;

@Data
public class OrderRequest {
    private String orderNumber;
    private Integer agentId;
    private String customerName;
    private String customerPhone;
    private String deliveryAddress;
    private List<OrderItemRequest> items;
}