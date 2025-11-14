package com.cgdms.CGDMS.agent.service.mapper;

import com.cgdms.CGDMS.agent.entity.Product;
import com.cgdms.CGDMS.agent.entity.request.ProductRequest;
import com.cgdms.CGDMS.agent.entity.response.ProductResponse;
import org.springframework.stereotype.Service;

@Service
public class ProductMapperService {

    public Product toProduct(ProductRequest request) {
        return Product.builder()
                .sku(request.getSku())
                .productName(request.getProductName())
                .unitSizeG(request.getUnitSizeG())
                .unitPrice(request.getUnitPrice())
                .categoryName(request.getCategoryName())
                .isActive(request.getIsActive())
                .archived(0)
                .build();
    }

    public ProductResponse toProductResponse(Product product) {
        ProductResponse response = new ProductResponse();
        response.setId(product.getId());
        response.setSku(product.getSku());
        response.setProductName(product.getProductName());
        response.setUnitSizeG(product.getUnitSizeG());
        response.setUnitPrice(product.getUnitPrice());
        response.setCategoryName(product.getCategoryName());
        response.setIsActive(product.getIsActive());
        return response;
    }
}