package com.cgdms.CGDMS.agent.entity.request;

import lombok.Data;

@Data
public class CommissionRuleRequest {
    private Long commissionSchemeId;
    private Long productId; // nullable
    private Integer minQty;
    private Integer maxQty;
    private String commissionType; // PER_UNIT or PERCENTAGE
    private Double commissionValue;
}