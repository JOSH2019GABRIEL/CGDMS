package com.cgdms.CGDMS.agent.service;

import com.cgdms.CGDMS.agent.entity.Order;
import com.cgdms.CGDMS.agent.entity.OrderItem;
import com.cgdms.CGDMS.agent.entity.Product;
import com.cgdms.CGDMS.agent.entity.request.OrderItemRequest;
import com.cgdms.CGDMS.agent.entity.request.OrderRequest;
import com.cgdms.CGDMS.agent.entity.response.OrderResponse;
import com.cgdms.CGDMS.agent.repository.OrderRepository;
import com.cgdms.CGDMS.agent.repository.ProductRepository;
import com.cgdms.CGDMS.agent.service.mapper.OrderItemMapperService;
import com.cgdms.CGDMS.agent.service.mapper.OrderMapperService;
import com.cgdms.CGDMS.common.AuthUtils;
import com.cgdms.CGDMS.common.PageResponse;
import com.cgdms.CGDMS.email.EmailServiceOrder;
import com.cgdms.CGDMS.fishmanagement.entity.FishHarvest;
import com.cgdms.CGDMS.fishmanagement.entity.response.FishHarvestResponse;
import com.cgdms.CGDMS.user.User;
import com.cgdms.CGDMS.user.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
@Slf4j
public class OrderService {

    private final OrderRepository orderRepository;
    private final UserRepository userRepository;
    private final OrderMapperService orderMapperService;
    private final AuthUtils authUtils;
    private final OrderItemMapperService orderItemMapperService;
    private final EmailServiceOrder emailServiceOrder;
    private final ProductRepository productRepository;


    /**
     * Create a new order from a request.
     */
    public OrderResponse createOrder(OrderRequest request) {

        User loggedInUser = authUtils.getCurrentUser();

        // Create and save new order
        Order order = orderMapperService.toOrder(request, loggedInUser);
        order = orderRepository.save(order);

        OrderResponse response = orderMapperService.toOrderResponse(order);

        // Safe map (allows null values)
        Map<String, Object> variables = new HashMap<>();
        variables.put("agentName", order.getAgent() != null ? order.getAgent().getUsername() : "N/A");
        variables.put("orderNumber", order.getOrderNumber());
        variables.put("customerName", order.getCustomerName());
        variables.put("customerPhone", order.getCustomerPhone());
        variables.put("deliveryAddress", order.getDeliveryAddress());
        variables.put("totalAmount", order.getTotalAmount());
        variables.put("orderDate", order.getOrderDate());
        variables.put("status", order.getStatus() != null ? order.getStatus().name() : "N/A");
        variables.put("orderDetailsUrl", "https://cgdms.com/orders/" + order.getId());

        // Send email to Agent
        try {
            if (order.getAgent() != null) {
                emailServiceOrder.sendEmail(
                        order.getAgent().getEmail(),
                        "New Order Created - " + order.getOrderNumber(),
                        "order-created-email",
                        variables
                );
            }
        } catch (Exception e) {
            log.error("Failed to send order email to agent: {}", e.getMessage());
        }

        // Send email to Fulfillment Center
        try {
            if (order.getFulfillmentCenterId() != null && order.getFulfillmentCenterId().getEmail() != null) {

                Map<String, Object> fcVariables = new HashMap<>(variables);
                fcVariables.put("recipientName", order.getFulfillmentCenterId().getCenterName());
                fcVariables.put("role", "Fulfillment Center");

                emailServiceOrder.sendEmail(
                        order.getFulfillmentCenterId().getEmail(),
                        "New Order Assigned - " + order.getOrderNumber(),
                        "order-created-email",
                        fcVariables
                );
            }
        } catch (Exception e) {
            log.error("Failed to send order email to fulfillment center: {}", e.getMessage());
        }

        return response;
    }

    /**
     * Get all orders.
     */
    @Transactional(readOnly = true)
    public PageResponse<OrderResponse> findAllOrders(int page, int size) {
        User loggedInUser = authUtils.getCurrentUser();
        boolean isAdmin = authUtils.isAdmin();
        Long farmId = authUtils.getCurrentUserFarmId();

        Pageable pageable = PageRequest.of(page, size, Sort.by("createdDate").descending());

        Page<Order> orders = isAdmin ? orderRepository.findAllNotArchived(pageable, farmId) : orderRepository.findAllNotArchivedForUsers(pageable, farmId, loggedInUser.getId());

        List<OrderResponse> responses = orders.stream()
                .map(orderMapperService::toOrderResponse)
                .toList();

        return new PageResponse<>(
                responses,
                orders.getNumber(),
                orders.getSize(),
                orders.getTotalElements(),
                orders.getTotalPages(),
                orders.isFirst(),
                orders.isLast()
        );
    }

    @Transactional(readOnly = true)
    public PageResponse<OrderResponse> findAllOrdersByStatus(int page, int size, String status) {
        User loggedInUser = authUtils.getCurrentUser();
        boolean isAdmin = authUtils.isAdmin();
        Long farmId = authUtils.getCurrentUserFarmId();

        Pageable pageable = PageRequest.of(page, size, Sort.by("createdDate").descending());

        Page<Order> orders = isAdmin ? orderRepository.findAllNotArchivedAndStatus(pageable, farmId, status) : orderRepository.findAllNotArchivedForUsersAndStatus(pageable, farmId, loggedInUser.getId(), status);

        List<OrderResponse> responses = orders.stream()
                .map(orderMapperService::toOrderResponse)
                .toList();

        return new PageResponse<>(
                responses,
                orders.getNumber(),
                orders.getSize(),
                orders.getTotalElements(),
                orders.getTotalPages(),
                orders.isFirst(),
                orders.isLast()
        );
    }

    /**
     * Get an order by ID.
     */
    @Transactional(readOnly = true)
    public OrderResponse findOrderById(Long orderId) {
        return orderRepository.findById(orderId)
                .map(orderMapperService::toOrderResponse)
                .orElseThrow(() -> new RuntimeException("Order not found with ID " + orderId));
    }

    /**
     * Update an existing order.
     */

//    @Transactional
    public OrderResponse updateOrder(Long id, OrderRequest dto) {

        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        // Update parent fields
        order.setOrderNumber(dto.getOrderNumber());
        order.setCustomerName(dto.getCustomerName());
        order.setCustomerPhone(dto.getCustomerPhone());
        order.setDeliveryAddress(dto.getDeliveryAddress());
        order.setTotalAmount(dto.getTotalAmount());

        // Remove existing items
        order.getItems().clear();

        // Re-add updated items
        for (OrderItemRequest itemReq : dto.getItems()) {

            Product product = productRepository.findById(itemReq.getProductId())
                    .orElseThrow(() -> new EntityNotFoundException("Product not found"));

            OrderItem item = new OrderItem();
            item.setProduct(product);
            item.setQuantity(itemReq.getQuantity());
            item.setUnitPrice(itemReq.getUnitPrice());
            item.setOrder(order); // VERY IMPORTANT

            order.getItems().add(item);
        }

        orderRepository.save(order);
        return orderMapperService.toOrderResponse(order);
    }

    /**
     * Delete an order by ID.
     */
    public void deleteOrder(Long id) {
        if (!orderRepository.existsById(id)) {
            throw new RuntimeException("Order not found with ID " + id);
        }
        orderRepository.deleteById(id);
    }

    public void deleteOrderSoft (Long id) {
      Order order = orderRepository.findById(id)
              .orElseThrow(() -> new RuntimeException("Order not found with ID " + id));
      order.setArchived(1);
      orderRepository.save(order);
    }


    /**
     * Update the order status (e.g., FULFILLED, CANCELLED).
     */
    public OrderResponse updateOrderStatus(Long orderId, Order.Status status) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found with ID " + orderId));
        order.setStatus(status);
        if (status == Order.Status.FULFILLED) {
            order.setFulfilledDate(LocalDateTime.now());
        }
        return orderMapperService.toOrderResponse(orderRepository.save(order));
    }

    /**
     * Get all orders for a specific agent.
     */
    @Transactional(readOnly = true)
    public PageResponse<OrderResponse> findAllOrdersByAgent(int page, int size, String agentId) {
        User loggedInUser = authUtils.getCurrentUser();
        boolean isAdmin = authUtils.isAdmin();
        Long farmId = authUtils.getCurrentUserFarmId();

        Pageable pageable = PageRequest.of(page, size, Sort.by("createdDate").descending());

        Page<Order> orders = isAdmin ? orderRepository.findAllNotArchived(pageable, farmId) : orderRepository.findAllNotArchivedForUsers(pageable, farmId, loggedInUser.getId());

        List<OrderResponse> responses = orders.stream()
                .map(orderMapperService::toOrderResponse)
                .toList();

        return new PageResponse<>(
                responses,
                orders.getNumber(),
                orders.getSize(),
                orders.getTotalElements(),
                orders.getTotalPages(),
                orders.isFirst(),
                orders.isLast()
        );
    }


}
