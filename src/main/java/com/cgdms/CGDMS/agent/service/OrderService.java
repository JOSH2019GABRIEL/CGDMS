package com.cgdms.CGDMS.agent.service;

import com.cgdms.CGDMS.agent.entity.FulfillmentEvent;
import com.cgdms.CGDMS.agent.entity.Order;
import com.cgdms.CGDMS.agent.entity.OrderItem;
import com.cgdms.CGDMS.agent.entity.Product;
import com.cgdms.CGDMS.agent.entity.request.OrderItemRequest;
import com.cgdms.CGDMS.agent.entity.request.OrderRequest;
import com.cgdms.CGDMS.agent.entity.response.FulfillmentEventResponse;
import com.cgdms.CGDMS.agent.entity.response.OrderResponse;
import com.cgdms.CGDMS.agent.entity.response.OrderStatsResponse;
import com.cgdms.CGDMS.agent.repository.FulfillmentEventRepository;
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

import java.time.LocalDate;
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
    private final FulfillmentEventRepository fulfillmentEventRepository;


    /**
     * Create a new order from a request.
     */
    public OrderResponse createOrder(OrderRequest request) {

        User loggedInUser = authUtils.getCurrentUser();

        // Save new order
        Order order = orderMapperService.toOrder(request, loggedInUser);
        order = orderRepository.save(order);

        // Create fulfillment event linked to the saved order
        FulfillmentEvent fulfillmentEvent = orderMapperService.orderToFulfillmentEvent(request, order);
        fulfillmentEventRepository.save(fulfillmentEvent);

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
        variables.put("status", order.getStatus() != null ? "Order submitted" : "N/A");
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
            if (order.getFulfillmentCenterId() != null && order.getFulfillmentCenterId().getId() != null) {

                Map<String, Object> fcVariables = new HashMap<>(variables);
                fcVariables.put("recipientName", order.getFulfillmentCenterId().getFarmName());
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


    public OrderResponse updateOrderCancelledStatus(Long id) {
        // Fetch Order
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Order not found"));

        // Retrieve associated fulfillment event
        FulfillmentEvent fulfillmentEvent = fulfillmentEventRepository
                .findByOrderId(order.getId())
                .orElseThrow(() -> new EntityNotFoundException("Event not found"));

        // Update statuses
        order.setStatus(Order.Status.CANCELLED);
        fulfillmentEvent.setStatus(Order.Status.CANCELLED); // Adjust if enum differs
        fulfillmentEvent.setFulfillmentTime(LocalDateTime.now());

        // Save updates
        orderRepository.save(order);
        fulfillmentEventRepository.save(fulfillmentEvent);

        // Prepare email template variables
        Map<String, Object> variables = new HashMap<>();
        variables.put("agentName", order.getAgent() != null ? order.getAgent().getUsername() : "N/A");
        variables.put("orderNumber", order.getOrderNumber());
        variables.put("customerName", order.getCustomerName());
        variables.put("customerPhone", order.getCustomerPhone());
        variables.put("deliveryAddress", order.getDeliveryAddress());
        variables.put("totalAmount", order.getTotalAmount());
        variables.put("orderDate", order.getOrderDate());
        variables.put("status", "Order has been cancelled");
        variables.put("failedDate", fulfillmentEvent.getFulfillmentTime());
        variables.put("orderDetailsUrl", "https://cgdms.com/orders/" + order.getId());

        // Send email to agent
        try {
            if (order.getAgent() != null && order.getAgent().getEmail() != null) {
                emailServiceOrder.sendEmail(
                        order.getAgent().getEmail(),
                        "Order Cancelled - " + order.getOrderNumber(),
                        "fulfilment-cancel-email",
                        variables
                );
            } else {
                log.warn("Order {} has no assigned agent or email.", order.getOrderNumber());
            }
        } catch (Exception e) {
            log.error("Failed to send cancellation email to agent: {}", e.getMessage());
        }

        return orderMapperService.toOrderResponse(order);
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


    public OrderStatsResponse getStats() {
        User loggedInUser = authUtils.getCurrentUser();
        Integer userId = loggedInUser.getId();

        long total = orderRepository.countByUserId(userId);
        long completed = orderRepository.countByUserIdAndStatus(userId, Order.Status.FULFILLED.name());
        long cancelled = orderRepository.countByUserIdAndStatus(userId, Order.Status.CANCELLED.name());
        long inProgress = orderRepository.countByUserIdAndStatus(userId, Order.Status.PROCESSING.name());
        double totalCommission = orderRepository.getAgentCommission(userId);
        double totalBuy = orderRepository.getAgentBuy(userId);

        return new OrderStatsResponse(total, completed, cancelled, inProgress, totalCommission, totalBuy);
    }


    public PageResponse<OrderMapperService.PerAgentReportResponse> getPerAgentReport(
            int page, int size, Integer agentId, LocalDate start, LocalDate end, String status) {

        LocalDateTime startDate = start.atStartOfDay();
        LocalDateTime endDate = end.atTime(23, 59, 59);

        // Fetch summary & top SKUs
        OrderMapperService.SummaryDTO summary = orderRepository.getSummary(agentId, startDate, endDate, status);
        List<OrderMapperService.TopSkuDTO> topSkus = orderRepository.getTopSkus(agentId, startDate, endDate, status);

        // Fetch paginated orders
        Pageable pageable = PageRequest.of(page, size, Sort.by("order_date").descending());
        Page<OrderMapperService.OrderTableDTO> ordersPage = orderRepository.getOrders(agentId, startDate, endDate, status, pageable);

        // Wrap in PerAgentReportResponse
        OrderMapperService.PerAgentReportResponse response = new OrderMapperService.PerAgentReportResponse(
                summary, topSkus, ordersPage.getContent()
        );

        // Return as a single-element PageResponse
        return new PageResponse<>(
                List.of(response), // wrap in list
                ordersPage.getNumber(),
                ordersPage.getSize(),
                ordersPage.getTotalElements(),
                ordersPage.getTotalPages(),
                ordersPage.isFirst(),
                ordersPage.isLast()
        );
    }




}
