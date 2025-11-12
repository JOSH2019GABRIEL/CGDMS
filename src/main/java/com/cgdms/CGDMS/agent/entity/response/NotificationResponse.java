package com.cgdms.CGDMS.agent.entity.response;

import com.cgdms.CGDMS.agent.entity.Notification;
import lombok.Builder;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Builder
public class NotificationResponse {
    private Long notificationId;
    private Long orderId;
    private Notification.RecipientType recipientType;
    private String recipientEmail;
    private String recipientPhone;
    private Notification.Type type;
    private Notification.Status status;
    private LocalDateTime sentAt;
    private String payload;
}