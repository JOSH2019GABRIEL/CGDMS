package com.cgdms.CGDMS.agent.entity.request;

import lombok.Data;

@Data
public class ProductRequest {
    private Long id;
    private String sku;
    private String productName;
    private Integer unitSizeG;
    private Double unitPrice;
    private Boolean isActive;
}
