package com.cgdms.CGDMS.agent.entity.response;

import lombok.Data;
import java.util.List;

@Data
public class CommissionSchemeResponse {
    private Long id;
    private Long commissionSchemeId;
    private String schemeName;
    private String description;
    private Boolean isActive;
    private List<CommissionRuleResponse> rules;
}