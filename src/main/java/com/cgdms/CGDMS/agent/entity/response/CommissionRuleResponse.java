package com.cgdms.CGDMS.agent.entity.response;

import com.cgdms.CGDMS.agent.entity.OrderItem;
import lombok.Data;

@Data
public class CommissionRuleResponse {
    private Long ruleId;
    private Long commissionSchemeId;
    private Long productId;
    private Integer minQty;
    private Integer maxQty;
    private OrderItem.CommissionType commissionType;
    private Double commissionValue;
}