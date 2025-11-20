package com.cgdms.CGDMS.agent.entity.request;

import com.cgdms.CGDMS.agent.entity.CommissionSchemeRule;
import lombok.Data;

@Data
public class CommissionRuleRequest {
    private Long commissionSchemeId;
    private Long productId; // nullable
    private Integer minQty;
    private Integer maxQty;
    private CommissionSchemeRule.CommissionType commissionType; // PER_UNIT or PERCENTAGE
    private Double commissionValue;
}