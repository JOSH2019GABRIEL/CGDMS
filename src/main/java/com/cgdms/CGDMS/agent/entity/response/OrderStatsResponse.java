package com.cgdms.CGDMS.agent.entity.response;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class OrderStatsResponse {
    private long totalOrders;
    private long completedOrders;
    private long cancelledOrders;
    private long inProgressOrders;
}