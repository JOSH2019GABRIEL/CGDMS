package com.cgdms.CGDMS.vegetables.harvestBatch;


import com.cgdms.CGDMS.base.BaseEntity;
import com.cgdms.CGDMS.vegetables.plots.Plot;
import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

import java.time.LocalDate;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@SuperBuilder
public class HarvestBatch extends BaseEntity {
    private LocalDate date;
    private Double harvestedQtyKg;
    private String marketGrade; // A / B / C
    private Double packedQtyKg;
    private String packType;

    @ManyToOne
    @JoinColumn(name = "plot_id")
    private Plot plot;
}