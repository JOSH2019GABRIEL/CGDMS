package com.cgdms.CGDMS.agent.entity.request;

import lombok.Data;

@Data
public class OrderItemRequest {
    private Long productId;
    private Integer quantity;
    private Double unitPrice;
}