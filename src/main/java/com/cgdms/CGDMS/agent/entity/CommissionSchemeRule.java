package com.cgdms.CGDMS.agent.entity;

import com.cgdms.CGDMS.base.BaseEntity;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;


@Entity
@Table(name = "commission_scheme_rules")
@Data
@AllArgsConstructor
@NoArgsConstructor
@SuperBuilder
public class CommissionSchemeRule extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "commission_scheme_id", nullable = false)
    private CommissionScheme commissionScheme;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id")
    private Product product;

    private Integer minQty;
    private Integer maxQty;

    @Enumerated(EnumType.STRING)
    private CommissionType commissionType;

    private Double commissionValue;

    public enum CommissionType {
        PER_UNIT, PERCENTAGE
    }
}
