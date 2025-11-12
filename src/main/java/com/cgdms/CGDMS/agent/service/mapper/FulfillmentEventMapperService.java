//package com.cgdms.CGDMS.agent.service.mapper;
//
//import com.cgdms.CGDMS.agent.entity.FulfillmentEvent;
//import com.cgdms.CGDMS.agent.entity.request.FulfillmentEventRequest;
//import com.cgdms.CGDMS.agent.entity.response.FulfillmentEventResponse;
//import com.cgdms.CGDMS.agent.repository.OrderRepository;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.stereotype.Service;
//
//import java.time.LocalDateTime;
//
//@Service
//public class FulfillmentEventMapperService {
//
//    @Autowired
//    private OrderRepository orderRepository;
//
//    public FulfillmentEvent toFulfillmentEvent(FulfillmentEventRequest request) {
//        var order = orderRepository.findById(request.getOrderId())
//                .orElseThrow(() -> new RuntimeException("Order not found with ID " + request.getOrderId()));
//
//        return FulfillmentEvent.builder()
//                .order(order)
//                .statusFrom(request.getStatusFrom())
//                .statusTo(request.getStatusTo())
//                .changedBy(request.getChangedBy())
//                .note(request.getNote())
//                .changedAt(LocalDateTime.now())
//                .build();
//    }
//
//    public FulfillmentEventResponse toFulfillmentEventResponse(FulfillmentEvent event) {
//        FulfillmentEventResponse response = new FulfillmentEventResponse();
//        response.setEventId(event.getId());
//        response.setOrderId(event.getOrder().getId());
//        response.setStatusFrom(event.getStatusFrom());
//        response.setStatusTo(event.getStatusTo());
////        response.setChangedBy(event.getChangedBy());
//        response.setNote(event.getNote());
////        response.setChangedAt(event.getChangedAt());
//        return response;
//    }
//}