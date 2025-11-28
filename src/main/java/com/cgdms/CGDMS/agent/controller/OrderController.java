package com.cgdms.CGDMS.agent.controller;


import com.cgdms.CGDMS.agent.entity.request.OrderRequest;
import com.cgdms.CGDMS.agent.entity.response.OrderResponse;
import com.cgdms.CGDMS.agent.entity.response.OrderStatsResponse;
import com.cgdms.CGDMS.agent.service.OrderService;
import com.cgdms.CGDMS.common.PageResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("order-place")
@Tag(name = "Orders")
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;


    @PostMapping
    public ResponseEntity<OrderResponse> saveOrder(@Valid @RequestBody OrderRequest request) {
        return ResponseEntity.ok(orderService.createOrder(request));
    }

    @PutMapping("/{id}/cancel")
    public ResponseEntity<OrderResponse> cancelOrder(@PathVariable Long id) {
        OrderResponse response = orderService.updateOrderCancelledStatus(id);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{id}")
    public ResponseEntity<OrderResponse> updateOrder(@Valid @RequestBody OrderRequest request) {
        return ResponseEntity.ok(orderService.updateOrder(request.getId(), request));
    }

    //    @PreAuthorize("hasAnyRole('ADMIN','USER')")
    @GetMapping
    public ResponseEntity<PageResponse<OrderResponse>> findAllOrders(
            @RequestParam(name = "page", defaultValue = "0", required = false) int page,
            @RequestParam(name = "size", defaultValue = "10", required = false) int size
    ) {
        return ResponseEntity.ok(orderService.findAllOrders(page, size));
    }

    @GetMapping("/order-status")
    public ResponseEntity<PageResponse<OrderResponse>> findAllOrdersByStatus(
            @RequestParam(name = "page", defaultValue = "0", required = false) int page,
            @RequestParam(name = "size", defaultValue = "10", required = false) int size,
            String status
    ) {
        return ResponseEntity.ok(orderService.findAllOrdersByStatus(page, size, status));
    }

    //    @PreAuthorize("hasAnyRole('ADMIN','USER')")
    @GetMapping("/{order-id}")
    public ResponseEntity<OrderResponse> getOrderById(@PathVariable("order-id") Long logId) {
        return ResponseEntity.ok(orderService.findOrderById(logId));
    }

    @PutMapping("/archive/{id}")
    public ResponseEntity<?> archiveOrder(@PathVariable Long id) {
        orderService.deleteOrderSoft(id);
        return ResponseEntity.ok("Order delete successfully");
    }

    @GetMapping("/order-stats")
    public ResponseEntity<OrderStatsResponse> getOrderStats(){
        return ResponseEntity.ok(orderService.getStats());
    }




}
