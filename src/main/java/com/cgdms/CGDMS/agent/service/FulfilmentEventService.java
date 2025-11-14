package com.cgdms.CGDMS.agent.service;

import com.cgdms.CGDMS.agent.entity.FulfillmentEvent;
import com.cgdms.CGDMS.agent.entity.Order;
import com.cgdms.CGDMS.agent.entity.request.FulfillmentEventRequest;
import com.cgdms.CGDMS.agent.entity.response.FulfillmentEventResponse;
import com.cgdms.CGDMS.agent.repository.FulfillmentEventRepository;
import com.cgdms.CGDMS.agent.repository.OrderRepository;
import com.cgdms.CGDMS.agent.service.mapper.FulfillmentEventMapperService;
import com.cgdms.CGDMS.common.AuthUtils;
import com.cgdms.CGDMS.common.PageResponse;
import com.cgdms.CGDMS.email.EmailServiceOrder;
import com.cgdms.CGDMS.user.User;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Slf4j
public class FulfilmentEventService {

    private final AuthUtils authUtils;
    private final FulfillmentEventMapperService mapper;
    private final EmailServiceOrder emailServiceOrder;
    private final FulfillmentEventRepository eventRepository;
    private final OrderRepository orderRepository;
    private final FulfillmentEventRepository fulfillmentEventRepository;


    public FulfillmentEventRequest saveFulfilment(FulfillmentEventRequest request) {
        FulfillmentEvent fulfillmentEvent;
        Order order;


        if (request.getId() != null) {
            //update existing
            fulfillmentEvent = eventRepository.findById(request.getId())
                    .orElseThrow(() -> new EntityNotFoundException("Fulfilment not found"));

            order = orderRepository.findById(request.getOrderId())
                            .orElseThrow(() -> new EntityNotFoundException("Order not found"));


            fulfillmentEvent.setOrder(order);
            fulfillmentEvent.setNote(request.getNote());
            fulfillmentEvent.setEmail(request.getEmail());
            fulfillmentEvent.setCenterName(request.getCenterName());
            fulfillmentEvent.setStatus(request.getStatus());
            fulfillmentEvent.setCreatedTime(LocalDateTime.now());
            fulfillmentEvent.setProcessingTime(null);
            fulfillmentEvent.setDispatchTime(null);
            fulfillmentEvent.setFulfillmentTime(null);

            fulfillmentEvent.setArchived(0);

        } else {
            fulfillmentEvent = mapper.toFulfillmentEvent(request);
        }

        fulfillmentEventRepository.save(fulfillmentEvent);
        return request;
    }


    public PageResponse<FulfillmentEventResponse> findAllFulfilEvents (int page, int size) {
        User loggedInUser = authUtils.getCurrentUser();
        boolean isAdmin = authUtils.isAdmin();
        Long farmId = authUtils.getCurrentUserFarmId();

        Pageable pageable = PageRequest.of(page, size, Sort.by("createdDate").descending());
        Page<FulfillmentEvent> fulfillmentEvents = isAdmin ? fulfillmentEventRepository.findAllNotArchived(pageable, farmId) : fulfillmentEventRepository.findAllNotArchivedForUsers(pageable, farmId, loggedInUser.getId());

        List<FulfillmentEventResponse> responses = fulfillmentEvents.stream()
                .map(mapper::toFulfillmentEventResponse)
                .toList();

        return new PageResponse<>(
                responses,
                fulfillmentEvents.getNumber(),
                fulfillmentEvents.getSize(),
                fulfillmentEvents.getTotalElements(),
                fulfillmentEvents.getTotalPages(),
                fulfillmentEvents.isFirst(),
                fulfillmentEvents.isLast()
        );
    }

    public PageResponse<FulfillmentEventResponse> findAllFulfilEventsByStatus (int page, int size, String status) {
        User loggedInUser = authUtils.getCurrentUser();
        boolean isAdmin = authUtils.isAdmin();
        Long farmId = authUtils.getCurrentUserFarmId();

        Pageable pageable = PageRequest.of(page, size, Sort.by("createdDate").descending());
        Page<FulfillmentEvent> fulfillmentEvents = isAdmin ? fulfillmentEventRepository.findAllNotArchivedAndStatus(pageable, farmId, status) : fulfillmentEventRepository.findAllNotArchivedForUsersAndStatus(pageable, farmId, loggedInUser.getId(), status);

        List<FulfillmentEventResponse> responses = fulfillmentEvents.stream()
                .map(mapper::toFulfillmentEventResponse)
                .toList();

        return new PageResponse<>(
                responses,
                fulfillmentEvents.getNumber(),
                fulfillmentEvents.getSize(),
                fulfillmentEvents.getTotalElements(),
                fulfillmentEvents.getTotalPages(),
                fulfillmentEvents.isFirst(),
                fulfillmentEvents.isLast()
        );
    }

    public FulfillmentEventResponse findFulfilmentEventById(Long id) {
        return fulfillmentEventRepository.findById(id)
                .map(mapper::toFulfillmentEventResponse)
                .orElseThrow(() -> new EntityNotFoundException("Event not found"));
    }

    public void deleteEventById(Long id) {
        FulfillmentEvent event = fulfillmentEventRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Event not found"));
        event.setArchived(1);
        fulfillmentEventRepository.save(event);
    }

    public FulfillmentEventResponse updateFulfilmentToProcessingStatus (Long id) {
        FulfillmentEvent fulfillmentEvent = fulfillmentEventRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Event not found"));

        Order order = orderRepository.findById(fulfillmentEvent.getOrder().getId())
                .orElseThrow(() -> new EntityNotFoundException("Order not found"));
        order.setStatus(Order.Status.PROCESSING);

        fulfillmentEvent.setStatus(Order.Status.PROCESSING);
        fulfillmentEvent.setProcessingTime(LocalDateTime.now());
        orderRepository.save(order);
        fulfillmentEventRepository.save(fulfillmentEvent);

        Map<String, Object> variables = Map.of(
                "agentName", order.getAgent().getUsername(),
                "orderNumber", order.getOrderNumber(),
                "customerName", order.getCustomerName(),
                "customerPhone", order.getCustomerPhone(),
                "deliveryAddress", order.getDeliveryAddress(),
                "totalAmount", order.getTotalAmount(),
                "orderDate", order.getOrderDate(),
                "status", fulfillmentEvent.getStatus(),
                "fulfilDate", fulfillmentEvent.getDispatchTime()

                //TODO generate url for the order with the order id
//                "orderDetailsUrl", "https://cgdms.com/orders/" + fulfillmentEvent.getOrder().getId()
        );

        // Send to Agent
        try {
            emailServiceOrder.sendEmail(
                    fulfillmentEvent.getOrder().getAgent().getEmail(),
                    "New Order Fulfilled - " + fulfillmentEvent.getOrder().getOrderNumber(),
                    "fulfilment-email",
                    variables
            );
        } catch (Exception e) {
            log.error("Failed to send order email to agent {}: {}", fulfillmentEvent.getOrder().getAgent().getEmail(), e.getMessage());
        }
        return mapper.toFulfillmentEventResponse(fulfillmentEvent);
    }

    public FulfillmentEventResponse updateFulfilmentToDispatchStatus (Long id) {
        FulfillmentEvent fulfillmentEvent = fulfillmentEventRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Event not found"));

        Order order = orderRepository.findById(fulfillmentEvent.getOrder().getId())
                .orElseThrow(() -> new EntityNotFoundException("Order not found"));
        order.setStatus(Order.Status.DISPATCHED);
        fulfillmentEvent.setStatus(Order.Status.DISPATCHED);
        fulfillmentEvent.setDispatchTime(LocalDateTime.now());
        fulfillmentEventRepository.save(fulfillmentEvent);

        Map<String, Object> variables = Map.of(
                "agentName", order.getAgent().getUsername(),
                "orderNumber", order.getOrderNumber(),
                "customerName", order.getCustomerName(),
                "customerPhone", order.getCustomerPhone(),
                "deliveryAddress", order.getDeliveryAddress(),
                "totalAmount", order.getTotalAmount(),
                "orderDate", order.getOrderDate(),
                "status", fulfillmentEvent.getStatus(),
                "fulfilDate", fulfillmentEvent.getDispatchTime()

                //TODO generate url for the order with the order id
//                "orderDetailsUrl", "https://cgdms.com/orders/" + fulfillmentEvent.getOrder().getId()
        );

        // Send to Agent
        try {
            emailServiceOrder.sendEmail(
                    fulfillmentEvent.getOrder().getAgent().getEmail(),
                    "New Order Fulfilled - " + fulfillmentEvent.getOrder().getOrderNumber(),
                    "fulfilment-email",
                    variables
            );
        } catch (Exception e) {
            log.error("Failed to send order email to agent {}: {}", fulfillmentEvent.getOrder().getAgent().getEmail(), e.getMessage());
        }

        return mapper.toFulfillmentEventResponse(fulfillmentEvent);
    }

    public FulfillmentEventResponse updateFulfilmentToFulfilledStatus (Long id) {
        FulfillmentEvent fulfillmentEvent = fulfillmentEventRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Event not found"));

        Order order = orderRepository.findById(fulfillmentEvent.getOrder().getId())
                .orElseThrow(() -> new EntityNotFoundException("Order not found"));

        order.setStatus(Order.Status.FULFILLED);
        fulfillmentEvent.setStatus(Order.Status.FULFILLED);
        fulfillmentEvent.setFulfillmentTime(LocalDateTime.now());

        orderRepository.save(order);
        fulfillmentEventRepository.save(fulfillmentEvent);

        //  Prepare template variables
        Map<String, Object> variables = Map.of(
                "agentName", order.getAgent().getUsername(),
                "orderNumber", order.getOrderNumber(),
                "customerName", order.getCustomerName(),
                "customerPhone", order.getCustomerPhone(),
                "deliveryAddress", order.getDeliveryAddress(),
                "totalAmount", order.getTotalAmount(),
                "orderDate", order.getOrderDate(),
                "status", fulfillmentEvent.getOrder().getStatus().name(),
                "fulfilDate", fulfillmentEvent.getOrder().getFulfilledDate()

                //TODO generate url for the order with the order id
//                "orderDetailsUrl", "https://cgdms.com/orders/" + fulfillmentEvent.getOrder().getId()
        );

        // Send to Agent
        try {
            emailServiceOrder.sendEmail(
                    fulfillmentEvent.getOrder().getAgent().getEmail(),
                    "New Order Fulfilled - " + fulfillmentEvent.getOrder().getOrderNumber(),
                    "fulfilment-email",
                    variables
            );
        } catch (Exception e) {
            log.error("Failed to send order email to agent {}: {}", fulfillmentEvent.getOrder().getAgent().getEmail(), e.getMessage());
        }

        return mapper.toFulfillmentEventResponse(fulfillmentEvent);
    }

    public FulfillmentEventResponse updateFulfilmentToFailedStatus (Long id) {
        FulfillmentEvent fulfillmentEvent = fulfillmentEventRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Event not found"));

        Order order = orderRepository.findById(fulfillmentEvent.getOrder().getId())
                .orElseThrow(() -> new EntityNotFoundException("Order not found"));

        order.setStatus(Order.Status.CANCELLED);
        fulfillmentEvent.setStatus(Order.Status.CANCELLED);
        fulfillmentEvent.setFulfillmentTime(LocalDateTime.now());

        orderRepository.save(order);
        fulfillmentEventRepository.save(fulfillmentEvent);

        //  Prepare template variables
        Map<String, Object> variables = Map.of(
                "agentName", order.getAgent().getUsername(),
                "orderNumber", order.getOrderNumber(),
                "customerName", order.getCustomerName(),
                "customerPhone", order.getCustomerPhone(),
                "deliveryAddress", order.getDeliveryAddress(),
                "totalAmount", order.getTotalAmount(),
                "orderDate", order.getOrderDate(),
                "status", fulfillmentEvent.getOrder().getStatus().name(),
                "fulfilDate", fulfillmentEvent.getOrder().getFulfilledDate()

                //TODO generate url for the order with the order id
//                "orderDetailsUrl", "https://cgdms.com/orders/" + fulfillmentEvent.getOrder().getId()
        );

        // Send to Agent
        try {
            emailServiceOrder.sendEmail(
                    fulfillmentEvent.getOrder().getAgent().getEmail(),
                    "New Order Failed - " + fulfillmentEvent.getOrder().getOrderNumber(),
                    "fulfilment-failed-email",
                    variables
            );
        } catch (Exception e) {
            log.error("Failed to send order email to agent {}: {}", fulfillmentEvent.getOrder().getAgent().getEmail(), e.getMessage());
        }

        return mapper.toFulfillmentEventResponse(fulfillmentEvent);
    }
}
