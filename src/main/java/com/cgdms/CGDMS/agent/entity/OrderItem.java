package com.cgdms.CGDMS.agent.entity;

import com.cgdms.CGDMS.base.BaseEntity;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

import java.math.BigDecimal;


@Table(name = "order_items")
@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@SuperBuilder
public class OrderItem extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "order_id", nullable = false)
    private Order order;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    private Integer quantity;

    private Double unitPrice;

    private Double lineTotal;

    private Double commissionRate;

    @Enumerated(EnumType.STRING)
    private CommissionType commissionType;


    private Double commissionAmount;

    public enum CommissionType {
        PER_UNIT, PERCENTAGE
    }
}