package com.cgdms.CGDMS.agent.entity.response;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class FulfillmentEventResponse {
    private Long eventId;
    private Long orderId;
    private String statusFrom;
    private String statusTo;
    private Long changedBy;
    private String note;
    private LocalDateTime changedAt;
}
