//package com.cgdms.CGDMS.agent.service.mapper;
//
//import com.cgdms.CGDMS.agent.entity.Notification;
//import com.cgdms.CGDMS.agent.entity.Order;
//import com.cgdms.CGDMS.agent.entity.request.NotificationRequest;
//import com.cgdms.CGDMS.agent.entity.response.NotificationResponse;
//import com.cgdms.CGDMS.agent.repository.OrderRepository;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.stereotype.Service;
//
//import java.time.LocalDateTime;
//
//@Service
//public class NotificationMapperService {
//
//    @Autowired
//    private OrderRepository orderRepository;
//
//    public Notification toNotification(NotificationRequest request) {
//        Order order = orderRepository.findById(request.getOrderId())
//                .orElseThrow(() -> new RuntimeException("Order not found with ID: " + request.getOrderId()));
//
//        return Notification.builder()
//                .order(order)
//                .recipientType(request.getRecipientType())
//                .recipientEmail(request.getRecipientEmail())
//                .recipientPhone(request.getRecipientPhone())
//                .type(request.getType())
//                .status(request.getStatus())
//                .sentAt(LocalDateTime.now())
//                .payload(request.getPayload())
//                .build();
//    }
//
//    public NotificationResponse toNotificationResponse(Notification notification) {
//        return NotificationResponse.builder()
//                .notificationId(notification.getId())
//                .orderId(notification.getOrder().getId())
//                .recipientType(notification.getRecipientType())
//                .recipientEmail(notification.getRecipientEmail())
//                .recipientPhone(notification.getRecipientPhone())
//                .type(notification.getType())
//                .status(notification.getStatus())
//                .sentAt(notification.getSentAt())
//                .payload(notification.getPayload())
//                .build();
//    }
//}