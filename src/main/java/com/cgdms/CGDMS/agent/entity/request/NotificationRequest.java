package com.cgdms.CGDMS.agent.entity.request;

import com.cgdms.CGDMS.agent.entity.Notification;
import lombok.Data;

    @Data
    public class NotificationRequest {
        private Long orderId;
        private Notification.RecipientType recipientType; // AGENT / FULFILLMENT_CENTER
        private String recipientEmail;
        private String recipientPhone;
        private Notification.Type type; // ORDER_CREATED / ORDER_DISPATCHED / ORDER_FULFILLED
        private Notification.Status status;
        private String payload;
    }
