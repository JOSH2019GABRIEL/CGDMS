//package com.cgdms.CGDMS.agent.service.mapper;
//
//import com.cgdms.CGDMS.agent.entity.Order;
//import com.cgdms.CGDMS.agent.entity.request.OrderRequest;
//import com.cgdms.CGDMS.agent.entity.response.OrderResponse;
//import com.cgdms.CGDMS.user.UserRepository;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.stereotype.Service;
//
//import java.time.LocalDateTime;
//import java.util.Collections;
//import java.util.stream.Collectors;
//
//@Service
//public class OrderMapperService {
//
//    @Autowired
//    private UserRepository agentRepository;
//
//    @Autowired
//    private OrderItemMapperService orderItemMapperService;
//
//    public Order toOrder(OrderRequest request) {
//        var agent = agentRepository.findById(request.getAgentId())
//                .orElseThrow(() -> new RuntimeException("Agent not found with ID " + request.getAgentId()));
//
//        Order order = Order.builder()
//                .orderNumber(request.getOrderNumber())
//                .agent(agent)
//                .customerName(request.getCustomerName())
//                .customerPhone(request.getCustomerPhone())
//                .deliveryAddress(request.getDeliveryAddress())
//                .status(Order.Status.PENDING_FULFILLMENT)
//                .orderDate(LocalDateTime.now())
//                .createdAt(LocalDateTime.now())
//                .build();
//
//        if (request.getItems() != null) {
//            var items = request.getItems().stream()
//                    .map(req -> orderItemMapperService.toOrderItem(req, order))
//                    .collect(Collectors.toList());
//            order.setItems(items);
//        }
//        return order;
//    }
//
//    public OrderResponse toOrderResponse(Order order) {
//        if (order == null) return null;
//
//        OrderResponse response = new OrderResponse();
//        response.setId(order.getId());
//        response.setOrderNumber(order.getOrderNumber());
//        response.setCustomerName(order.getCustomerName());
//        response.setCustomerPhone(order.getCustomerPhone());
//        response.setDeliveryAddress(order.getDeliveryAddress());
//        response.setTotalAmount(order.getTotalAmount());
//        response.setTotalCommission(order.getTotalCommission());
//        response.setStatus(order.getStatus());
//
//        // Fulfillment center could be null; defensively set only if present
//        if (order.getFulfillmentCenterId() != null) {
//            response.setFulfillmentCenterId(order.getFulfillmentCenterId().getId());
//        } else {
//            response.setFulfillmentCenterId(null);
//        }
//
//        response.setOrderDate(order.getOrderDate());
//        response.setFulfilledDate(order.getFulfilledDate());
//        response.setCreatedAt(order.getCreatedAt());
//
//        // Safe mapping for items: null-safe and avoids streaming a null list
//        if (order.getItems() != null && orderItemMapperService != null) {
//            response.setItems(
//                    order.getItems().stream()
//                            .map(orderItemMapperService::toOrderItemResponse)
//                            .collect(Collectors.toList())
//            );
//        } else {
//            response.setItems(Collections.emptyList());
//        }
//
//        return response;
//    }
//}