package com.cgdms.CGDMS.agent.entity.response;

import com.cgdms.CGDMS.agent.entity.Order;
import lombok.Builder;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Builder
public class FulfillmentEventResponse {
    private Long id;
    private Long orderId;
    private String statusFrom;
    private String statusTo;
    private Long changedBy;
    private String note;

    private String email;
    private String centerName;
    private Order.Status status;

    private LocalDateTime createdTime;
//    private String processingStatus;
    private LocalDateTime processingTime;
//    private String dispatchStatus;
    private LocalDateTime dispatchTime;
//    private String fulfillmentStatus;
    private LocalDateTime fulfillmentTime;
}
