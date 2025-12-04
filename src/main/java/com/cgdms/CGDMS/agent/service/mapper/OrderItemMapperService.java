package com.cgdms.CGDMS.agent.service.mapper;

import com.cgdms.CGDMS.agent.entity.Order;
import com.cgdms.CGDMS.agent.entity.OrderItem;
import com.cgdms.CGDMS.agent.entity.request.OrderItemRequest;
import com.cgdms.CGDMS.agent.entity.response.OrderItemResponse;
import com.cgdms.CGDMS.agent.repository.ProductRepository;
import com.cgdms.CGDMS.agent.service.CommisionSchemeService;
import lombok.RequiredArgsConstructor;
import org.apache.coyote.BadRequestException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;


@Service
@RequiredArgsConstructor
public class OrderItemMapperService {

    private final ProductRepository productRepository;
    private final ProductMapperService productMapperService;
    private final CommisionSchemeService commisionSchemeService;


    public OrderItem toOrderItem(OrderItemRequest request, Order order) throws BadRequestException {
        var product = productRepository.findById(request.getProductId())
                .orElseThrow(() -> new RuntimeException("Product not found with ID " + request.getProductId()));

        double lineTotal = request.getQuantity() * request.getUnitPrice();

        return OrderItem.builder()
                .order(order)
                .product(product)
                .quantity(request.getQuantity())
                .unitPrice(request.getUnitPrice())
                .lineTotal(lineTotal)
                .commissionAmount(commisionSchemeService.applyCommission(product.getId(), request.getQuantity(), lineTotal))
                .archived(0)
                .build();
    }

    public OrderItemResponse toOrderItemResponse(OrderItem item) {
        OrderItemResponse response = new OrderItemResponse();
        response.setOrderItemId(item.getId());



        // Map full product details (not just ID)
        if (item.getProduct() != null) {
            response.setProduct(productMapperService.toProductResponse(item.getProduct()));
        }
        response.setQuantity(item.getQuantity());
        response.setUnitPrice(item.getUnitPrice());
        response.setLineTotal(item.getLineTotal());
        response.setCommissionRate(item.getCommissionRate());
        response.setCommissionType(item.getCommissionType());
        response.setCommissionAmount(item.getCommissionAmount());
        return response;
    }
}