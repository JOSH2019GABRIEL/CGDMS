package com.cgdms.CGDMS.agent.entity.response;

import com.cgdms.CGDMS.agent.entity.CommissionSchemeRule;
import com.cgdms.CGDMS.agent.entity.OrderItem;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class CommissionRuleResponse {
    private Long id;
    private Long commissionSchemeId;
    private Long productId;
    private Integer minQty;
    private Integer maxQty;
    private CommissionSchemeRule.CommissionType commissionType;
    private Double commissionValue;
}