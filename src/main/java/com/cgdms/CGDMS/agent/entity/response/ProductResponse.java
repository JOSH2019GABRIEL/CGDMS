package com.cgdms.CGDMS.agent.entity.response;

import lombok.Data;

@Data
public class ProductResponse {
    private Long id;
    private String sku;
    private String productName;
    private Integer unitSizeG;
    private Double unitPrice;
    private String categoryName;
    private Boolean isActive;
}
