package com.cgdms.CGDMS.agent.service;

import com.cgdms.CGDMS.agent.entity.Product;
import com.cgdms.CGDMS.agent.entity.request.ProductRequest;
import com.cgdms.CGDMS.agent.entity.response.ProductResponse;
import com.cgdms.CGDMS.agent.repository.ProductRepository;
import com.cgdms.CGDMS.agent.service.mapper.ProductMapperService;
import com.cgdms.CGDMS.common.AuthUtils;
import com.cgdms.CGDMS.common.PageResponse;
import com.cgdms.CGDMS.user.User;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ProductService {

    private final AuthUtils authUtils;
    private final ProductRepository productRepository;
    private final ProductMapperService mapper;


    public ProductRequest saveProduct(ProductRequest request) {
        Product product;


        if (request.getId() != null) {
            //update existing
            product = productRepository.findById(request.getId())
                    .orElseThrow(() -> new EntityNotFoundException("Product not found"));


            product.setSku(request.getSku());
            product.setProductName(request.getProductName());
            product.setUnitSizeG(request.getUnitSizeG());
            product.setUnitPrice(request.getUnitPrice());
            product.setIsActive(request.getIsActive());
            product.setArchived(0);


        } else {
            product = mapper.toProduct(request);
        }

        productRepository.save(product);
        return request;
    }


    public PageResponse<ProductResponse> findAllProducts(int page, int size) {
        Long farmId = authUtils.getCurrentUserFarmId();
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdDate").descending());

        Page<Product> products =  productRepository.findAllNotArchived(pageable, farmId);
        List<ProductResponse> responses = products.stream()
                .map(mapper::toProductResponse)
                .toList();
        return new PageResponse<>(
                responses,
                products.getNumber(),
                products.getSize(),
                products.getTotalElements(),
                products.getTotalPages(),
                products.isFirst(),
                products.isLast()
        );
    }

    public ProductResponse findProductById(Long id) {
        return productRepository.findById(id)
                .map(mapper::toProductResponse)
                .orElseThrow(() -> new EntityNotFoundException("Product not found"));
    }

    public void deleteProductById(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Product not found"));
        product.setArchived(1);
        productRepository.save(product);
    }

}
