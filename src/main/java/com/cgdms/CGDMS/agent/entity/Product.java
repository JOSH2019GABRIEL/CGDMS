package com.cgdms.CGDMS.agent.entity;

import com.cgdms.CGDMS.base.BaseEntity;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;



@Table(name = "products")
@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@SuperBuilder
public class Product extends BaseEntity {


    @Column(nullable = false, unique = true, length = 50)
    private String sku;

    @Column(nullable = false)
    private String productName;

    private Integer unitSizeG;

    private Double unitPrice;

    private String categoryName;

    private Boolean isActive = true;
}
