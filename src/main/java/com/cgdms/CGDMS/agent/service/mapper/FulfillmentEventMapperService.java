package com.cgdms.CGDMS.agent.service.mapper;

import com.cgdms.CGDMS.agent.entity.FulfillmentEvent;
import com.cgdms.CGDMS.agent.entity.Order;
import com.cgdms.CGDMS.agent.entity.request.FulfillmentEventRequest;
import com.cgdms.CGDMS.agent.entity.response.FulfillmentEventResponse;
import com.cgdms.CGDMS.agent.repository.OrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;


@Service
public class FulfillmentEventMapperService {

    @Autowired
    private OrderRepository orderRepository;

    public FulfillmentEvent toFulfillmentEvent(FulfillmentEventRequest request) {
        var order = orderRepository.findById(request.getOrderId())
                .orElseThrow(() -> new RuntimeException("Order not found with ID " + request.getOrderId()));

        return FulfillmentEvent.builder()
                .id(request.getId())
                .order(order)
                .note(request.getNote())
                .email(request.getEmail())
                .centerName(request.getCenterName())
                .status(Order.Status.PENDING_FULFILLMENT)
                .createdTime(LocalDateTime.now())
                .archived(0)
                .build();
    }

    public FulfillmentEventResponse toFulfillmentEventResponse(FulfillmentEvent event) {
        if (event == null) {return null;}

        return FulfillmentEventResponse.builder()
                .id(event.getId())
                .orderId(event.getOrder().getId())
                .orderNumber(event.getOrder().getOrderNumber())
                .note(event.getNote())
                .email(event.getEmail())
                .centerName(event.getCenterName())
                .status(event.getStatus())
                .createdTime(event.getCreatedTime())
                .processingTime(event.getProcessingTime())
                .dispatchTime(event.getDispatchTime())
                .fulfillmentTime(event.getFulfillmentTime())
                .build();
    }
}