package com.cgdms.CGDMS.agent.entity.response;

import com.cgdms.CGDMS.agent.entity.OrderItem;
import lombok.Builder;
import lombok.Data;

@Data
public class OrderItemResponse {
    private Long orderItemId;
    private ProductResponse product;
    private Integer quantity;
    private Double unitPrice;
    private Double lineTotal;
    private Double commissionRate;
    private OrderItem.CommissionType commissionType;
    private Double commissionAmount;
}
