package com.cgdms.CGDMS.fishmanagement.entity;

import com.cgdms.CGDMS.base.BaseEntity;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@SuperBuilder
@Table(name = "fish-post-harvest")
public class PostHarvest extends BaseEntity {

    @Column(name = "destination_type", length = 50, nullable = false)
    private String destinationType;  // e.g. Live Sale / Smoking Plant / Internal Transfer

    @Column(name = "quantity_to_live_sale_kg")
    private Double quantityToLiveSaleKg;

    @Column(name = "quantity_to_smoking_kg")
    private Double quantityToSmokingKg;

    @Column(name = "destination_batch_no", length = 100)
    private String destinationBatchNo;

    @Column(name = "transfer_date")
    private LocalDate transferDate;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "harvest_id", nullable = false)
    private FishHarvest harvest;
}
