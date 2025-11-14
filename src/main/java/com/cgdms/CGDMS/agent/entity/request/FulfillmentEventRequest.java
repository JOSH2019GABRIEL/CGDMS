package com.cgdms.CGDMS.agent.entity.request;

import com.cgdms.CGDMS.agent.entity.Order;
import lombok.Data;


@Data
public class FulfillmentEventRequest {
    private Long id;
    private Long orderId;
    private String statusFrom;
    private String statusTo;
    private Long changedBy;
    private String note;
    private String email;
    private String centerName;
    private Order.Status status;

}