package com.cgdms.CGDMS.agent.entity.request;

import lombok.Data;

@Data
public class CommissionSchemeRequest {
    private String schemeName;
    private String description;
    private Boolean isActive;
}
