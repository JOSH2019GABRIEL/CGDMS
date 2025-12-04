package com.cgdms.CGDMS.agent.service.mapper;

import com.cgdms.CGDMS.agent.entity.FulfillmentEvent;
import com.cgdms.CGDMS.agent.entity.Order;
import com.cgdms.CGDMS.agent.entity.request.OrderRequest;
import com.cgdms.CGDMS.agent.entity.response.OrderResponse;
import com.cgdms.CGDMS.agent.repository.OrderRepository;
import com.cgdms.CGDMS.common.AuthUtils;
import com.cgdms.CGDMS.farm.Farm;
import com.cgdms.CGDMS.farm.FarmRepository;
import com.cgdms.CGDMS.user.User;
import com.cgdms.CGDMS.user.UserRepository;
import lombok.RequiredArgsConstructor;
import org.apache.coyote.BadRequestException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.sql.Timestamp;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class OrderMapperService {

    private final UserRepository agentRepository;
    private final OrderRepository orderRepository;
    private final OrderItemMapperService orderItemMapperService;

    private final AuthUtils authUtils;
    private final FarmRepository farmRepository;


    public Order toOrder(OrderRequest request, User agentId) {
        User loggedInUser = authUtils.getCurrentUser();
        Farm farm;


        var agent = agentRepository.findById(loggedInUser.getId())
                .orElseThrow(() -> new RuntimeException("Agent not found with ID " + request.getAgentId()));

        farm = farmRepository.findById(request.getFulfillmentCenterId())
                .orElseThrow(()-> new RuntimeException("Farm not found with ID " + request.getFulfillmentCenterId()));

        Order order = Order.builder()
                .orderNumber(request.getOrderNumber())
                .agent(agent)
                .customerName(request.getCustomerName())
                .customerPhone(request.getCustomerPhone())
                .deliveryAddress(request.getDeliveryAddress())
                .status(Order.Status.PENDING_FULFILLMENT)
                .email(request.getEmail())
                .totalAmount(request.getTotalAmount())
                .orderDate(LocalDateTime.now())
                .fulfillmentCenterId(farm)
                .archived(0)
                .build();

        if (request.getItems() != null) {
            var items = request.getItems().stream()
                    .map(req -> {
                        try {
                            return orderItemMapperService.toOrderItem(req, order);
                        } catch (BadRequestException e) {
                            throw new RuntimeException(e);
                        }
                    })
                    .collect(Collectors.toList());
            order.setItems(items);
        }
        return order;
    }

    public OrderResponse toOrderResponse(Order order) {
        if (order == null) return null;

        OrderResponse response = new OrderResponse();
        response.setId(order.getId());
        response.setOrderNumber(order.getOrderNumber());
        response.setCustomerName(order.getCustomerName());
        response.setCustomerPhone(order.getCustomerPhone());
        response.setDeliveryAddress(order.getDeliveryAddress());
        response.setTotalAmount(order.getTotalAmount());
        response.setTotalCommission(order.getTotalCommission());
        response.setStatus(order.getStatus());
        response.setEmail(order.getEmail());

        // Fulfillment center could be null; defensively set only if present
        if (order.getFulfillmentCenterId() != null) {
            response.setFulfillmentCenterId(order.getFulfillmentCenterId().getId());
        } else {
            response.setFulfillmentCenterId(null);
        }

        response.setOrderDate(order.getOrderDate());
        response.setFulfilledDate(order.getFulfilledDate());

        // Safe mapping for items: null-safe and avoids streaming a null list
        if (order.getItems() != null && orderItemMapperService != null) {
            response.setItems(
                    order.getItems().stream()
                            .map(orderItemMapperService::toOrderItemResponse)
                            .collect(Collectors.toList())
            );
        } else {
            response.setItems(Collections.emptyList());
        }

        return response;
    }

    public FulfillmentEvent orderToFulfillmentEvent(OrderRequest request, Order order) {
        if (request == null) return null;
        Farm farm;

//        order = orderRepository.findById(request.getId())
//                .orElseThrow(() -> new RuntimeException("Order not found with ID " + request.getId()));

        farm = farmRepository.findById(request.getFulfillmentCenterId())
                .orElseThrow(() -> new RuntimeException("Order not found with ID " + request.getFulfillmentCenterId()));


        return FulfillmentEvent.builder()
                .order(order)
                .orderNumber(order.getOrderNumber())
                .note(null)
                .email(order.getEmail())
                .centerName(farm.getFarmName())
                .status(Order.Status.PENDING_FULFILLMENT)
                .createdTime(LocalDateTime.now())
                .archived(0)
                .build();
    }

    public record SummaryDTO(Long totalOrders, Long totalUnits, Double totalSales, Double totalCommission, Double averageValue) {}

    public record TopSkuDTO(String sku, Long totalUnits, Double value) {}

//    public record OrderTableDTO(Long orderId, String customer, Timestamp date, Integer units, Double amount, Double commission) {}

    public interface OrderTableDTO {
        Long getOrderId();
        String getCustomer();
        LocalDateTime getDate();
        Integer getUnits();
        Double getAmount();
        Double getCommission();
    }


    public record PerAgentReportResponse(
            SummaryDTO summary,
            List<TopSkuDTO> topSkus,
            List<OrderTableDTO> orders
    ) {}

}