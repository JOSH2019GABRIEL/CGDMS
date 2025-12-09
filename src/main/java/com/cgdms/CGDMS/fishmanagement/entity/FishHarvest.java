package com.cgdms.CGDMS.fishmanagement.entity;

import com.cgdms.CGDMS.base.BaseEntity;
import com.cgdms.CGDMS.batch.Batch;
import com.cgdms.CGDMS.pond.Pond;
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
@Table(name = "fish-harvests")
public class FishHarvest extends BaseEntity {

    @ManyToOne(optional = false, fetch = FetchType.LAZY)
    @JoinColumn(name = "pond_id", nullable = false)
    private Pond pond;

    @Column(name = "harvest_date")
    private LocalDate harvestDate;

    @Column(name = "harvest_officer", length = 100)
    private String harvestOfficer;

    @Column(name = "production_cycle", length = 50)
    private String productionCycle;

    @Column(name = "total_fish_harvested")
    private Integer totalFishHarvested;

    @Column(name = "average_weight_kg")
    private Double averageWeightKg;

    @Column(name = "total_weight_kg")
    private Double totalWeightKg;

    @Column(name = "mortality_during_harvest")
    private Double mortalityDuringHarvest;

    @Column(name = "grading_category", length = 50)
    private String gradingCategory;

    @Column(name = "harvest_batch_id")
    private String harvestBatchId;
}