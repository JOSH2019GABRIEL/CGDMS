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
import com.cgdms.CGDMS.fishmanagement.entity.PostHarvest;
import com.cgdms.CGDMS.fishmanagement.repository.FishPostHarvestRepository;
import com.cgdms.CGDMS.user.User;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
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
    private final FishPostHarvestRepository fishPostHarvestRepository;


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

    public PageResponse<FulfillmentEventResponse> findAllFulfilEventsByStatus (int page, int size, Order.Status status) {
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

    @Transactional
    public FulfillmentEventResponse updateFulfilmentToProcessingStatus(Long id, String processingType, int processedQty, String postHarvestId) {

        // Fetch event
        FulfillmentEvent fulfillmentEvent = fulfillmentEventRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Event not found"));

        // Fetch related order
        Order order = orderRepository.findById(fulfillmentEvent.getOrder().getId())
                .orElseThrow(() -> new EntityNotFoundException("Order not found"));

        // Update order status
        order.setStatus(Order.Status.PROCESSING);

        // Fetch post-harvest batch
        System.out.println("Got here_____ " +postHarvestId);
        PostHarvest postHarvest = fishPostHarvestRepository
                .findByPostHarvestId(postHarvestId, fulfillmentEvent.getFarm().getId())
                .orElseThrow(() -> new EntityNotFoundException("Post harvest not found"));


        if (processedQty <= 0) {
            throw new IllegalArgumentException("Processed quantity must be greater than 0");
        }

        switch (processingType) {

            case "quantityToSmokingKg": {

                if (processedQty > postHarvest.getQuantityToSmokingKg()) {
                    throw new IllegalArgumentException(
                            "Processed quantity exceeds available Smoking quantity (" +
                                    postHarvest.getQuantityToSmokingKg() + ")"
                    );
                }

                postHarvest.setQuantityToSmokingKg(
                        postHarvest.getQuantityToSmokingKg() - processedQty
                );
                break;
            }

            case "quantityToLiveSaleKg": {

                if (processedQty > postHarvest.getQuantityToLiveSaleKg()) {
                    throw new IllegalArgumentException(
                            "Processed quantity exceeds available LiveSale quantity (" +
                                    postHarvest.getQuantityToLiveSaleKg() + ")"
                    );
                }

                postHarvest.setQuantityToLiveSaleKg(
                        postHarvest.getQuantityToLiveSaleKg() - processedQty
                );
                break;
            }

            default:
                throw new IllegalArgumentException("Invalid processing type: " + processingType);
        }

        // Save the updated inventory
        fishPostHarvestRepository.save(postHarvest);


        // Update fulfillment event
        fulfillmentEvent.setStatus(Order.Status.PROCESSING);
        fulfillmentEvent.setProcessingTime(LocalDateTime.now());
        fulfillmentEvent.setCategory(order.getCategory());
        fulfillmentEvent.setPostHarvestId(postHarvestId);
        fulfillmentEvent.setProcessedNumber(processedQty);

        // Save everything
        orderRepository.save(order);
        fulfillmentEventRepository.save(fulfillmentEvent);


        // Build email content
        Map<String, Object> variables = new HashMap<>();
        variables.put("agentName",
                order.getAgent() != null ? order.getAgent().getUsername() : "N/A");

        variables.put("orderNumber", order.getOrderNumber());
        variables.put("customerName", order.getCustomerName());
        variables.put("customerPhone", order.getCustomerPhone());
        variables.put("deliveryAddress", order.getDeliveryAddress());
        variables.put("totalAmount", order.getTotalAmount());
        variables.put("orderDate", order.getOrderDate());

        variables.put("status", "Order is being processed");
        variables.put("processedDate", fulfillmentEvent.getProcessingTime());
        variables.put("processingType", processingType);
        variables.put("processedQty", processedQty);

        variables.put("orderDetailsUrl", "https://cgdms.com/orders/" + order.getId());


        // Send email to agent
        try {
            String agentEmail = order.getAgent() != null ? order.getAgent().getEmail() : null;

            if (agentEmail != null) {
                emailServiceOrder.sendEmail(
                        agentEmail,
                        "Order Processed - " + order.getOrderNumber(),
                        "fulfilment-processed-email",
                        variables
                );
            } else {
                log.warn("Order {} has no assigned agent email.", order.getId());
            }
        } catch (Exception e) {
            log.error("Failed to send processing email for order {}: {}",
                    order.getId(), e.getMessage());
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

        Map<String, Object> variables = new HashMap<>();
        variables.put("agentName", order.getAgent() != null ? order.getAgent().getUsername() : "N/A");
        variables.put("orderNumber", order.getOrderNumber());
        variables.put("customerName", order.getCustomerName());
        variables.put("customerPhone", order.getCustomerPhone());
        variables.put("deliveryAddress", order.getDeliveryAddress());
        variables.put("totalAmount", order.getTotalAmount());
        variables.put("orderDate", order.getOrderDate());
        variables.put("status", order.getStatus() != null ? "Order is been dispatched" : "N/A");
        variables.put("dispatchedDate", fulfillmentEvent.getFulfillmentTime());
        variables.put("orderDetailsUrl", "https://cgdms.com/orders/" + order.getId());

        // Send to Agent
        try {
            emailServiceOrder.sendEmail(
                    fulfillmentEvent.getOrder().getAgent().getEmail(),
                    "Order Dispatched - " + fulfillmentEvent.getOrder().getOrderNumber(),
                    "fulfilment-dispatch-email",
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
        Map<String, Object> variables = new HashMap<>();
        variables.put("agentName", order.getAgent() != null ? order.getAgent().getUsername() : "N/A");
        variables.put("orderNumber", order.getOrderNumber());
        variables.put("customerName", order.getCustomerName());
        variables.put("customerPhone", order.getCustomerPhone());
        variables.put("deliveryAddress", order.getDeliveryAddress());
        variables.put("totalAmount", order.getTotalAmount());
        variables.put("orderDate", order.getOrderDate());
        variables.put("status", order.getStatus() != null ? "Order has been delivered/completed" : "N/A");
        variables.put("fulfilledDate", fulfillmentEvent.getFulfillmentTime());
        variables.put("orderDetailsUrl", "https://cgdms.com/orders/" + order.getId());

        // Send to Agent
        try {
            emailServiceOrder.sendEmail(
                    fulfillmentEvent.getOrder().getAgent().getEmail(),
                    "Order Fulfilled - " + fulfillmentEvent.getOrder().getOrderNumber(),
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
        Map<String, Object> variables = new HashMap<>();
        variables.put("agentName", order.getAgent() != null ? order.getAgent().getUsername() : "N/A");
        variables.put("orderNumber", order.getOrderNumber());
        variables.put("customerName", order.getCustomerName());
        variables.put("customerPhone", order.getCustomerPhone());
        variables.put("deliveryAddress", order.getDeliveryAddress());
        variables.put("totalAmount", order.getTotalAmount());
        variables.put("orderDate", order.getOrderDate());
        variables.put("status", order.getStatus() != null ? "Order has been cancelled" : "N/A");
        variables.put("failedDate", fulfillmentEvent.getFulfillmentTime());
        variables.put("orderDetailsUrl", "https://cgdms.com/orders/" + order.getId());

        // Send to Agent
        try {
            emailServiceOrder.sendEmail(
                    fulfillmentEvent.getOrder().getAgent().getEmail(),
                    "Order cancelled - " + fulfillmentEvent.getOrder().getOrderNumber(),
                    "fulfilment-cancel-email",
                    variables
            );
        } catch (Exception e) {
            log.error("Failed to send order email to agent {}: {}", fulfillmentEvent.getOrder().getAgent().getEmail(), e.getMessage());
        }

        return mapper.toFulfillmentEventResponse(fulfillmentEvent);
    }
}
