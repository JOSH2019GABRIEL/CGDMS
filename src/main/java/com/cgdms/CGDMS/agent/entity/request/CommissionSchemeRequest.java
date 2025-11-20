package com.cgdms.CGDMS.agent.entity.request;

import lombok.Data;

import java.util.List;

@Data
public class CommissionSchemeRequest {
    private Long id;
    private String schemeName;
    private String description;
    private Boolean isActive;
    private List<CommissionRuleRequest> rules;
}
