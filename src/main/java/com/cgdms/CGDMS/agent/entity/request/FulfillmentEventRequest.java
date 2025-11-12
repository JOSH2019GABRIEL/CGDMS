package com.cgdms.CGDMS.agent.entity.request;

import lombok.Data;

@Data
public class FulfillmentEventRequest {
    private Long orderId;
    private String statusFrom;
    private String statusTo;
    private Long changedBy;
    private String note;
}