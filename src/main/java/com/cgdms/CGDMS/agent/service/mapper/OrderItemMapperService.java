//package com.cgdms.CGDMS.agent.service.mapper;
//
//import com.cgdms.CGDMS.agent.entity.Order;
//import com.cgdms.CGDMS.agent.entity.OrderItem;
//import com.cgdms.CGDMS.agent.entity.request.OrderItemRequest;
//import com.cgdms.CGDMS.agent.entity.response.OrderItemResponse;
//import com.cgdms.CGDMS.agent.repository.ProductRepository;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.stereotype.Service;
//
//import java.util.Collections;
//import java.util.stream.Collectors;
//
//@Service
//public class OrderItemMapperService {
//
//    @Autowired
//    private ProductRepository productRepository;
//
//    @Autowired
//    private ProductMapperService productMapperService;
//
//    public OrderItem toOrderItem(OrderItemRequest request, Order order) {
//        var product = productRepository.findById(request.getProductId())
//                .orElseThrow(() -> new RuntimeException("Product not found with ID " + request.getProductId()));
//
//        double lineTotal = request.getQuantity() * request.getUnitPrice();
//
//        return OrderItem.builder()
//                .order(order)
//                .product(product)
//                .quantity(request.getQuantity())
//                .unitPrice(request.getUnitPrice())
//                .lineTotal(lineTotal)
//                .build();
//    }
//
//    public OrderItemResponse toOrderItemResponse(OrderItem item) {
//        OrderItemResponse response = new OrderItemResponse();
//        response.setOrderItemId(item.getId());
//
//
//
//        // Map full product details (not just ID)
//        if (item.getProduct() != null) {
//            response.setProduct(productMapperService.toProductResponse(item.getProduct()));
//        }
//        response.setQuantity(item.getQuantity());
//        response.setUnitPrice(item.getUnitPrice());
//        response.setLineTotal(item.getLineTotal());
//        response.setCommissionRate(item.getCommissionRate());
//        response.setCommissionType(item.getCommissionType());
//        response.setCommissionAmount(item.getCommissionAmount());
//        return response;
//    }
//}