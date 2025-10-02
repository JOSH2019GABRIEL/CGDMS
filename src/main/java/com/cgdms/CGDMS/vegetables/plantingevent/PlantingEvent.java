package com.cgdms.CGDMS.vegetables.plantingevent;

import com.cgdms.CGDMS.base.BaseEntity;
import com.cgdms.CGDMS.vegetables.crop.CropVariety;
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
public class PlantingEvent extends BaseEntity {
    private String seedBatch;
    private Integer seedCount;
    private LocalDate date;
    private LocalDate expectedHarvestDate;

    @ManyToOne
    @JoinColumn(name = "plot_id")
    private Plot plot;

    @ManyToOne
    @JoinColumn(name = "crop_id")
    private CropVariety crop;
}