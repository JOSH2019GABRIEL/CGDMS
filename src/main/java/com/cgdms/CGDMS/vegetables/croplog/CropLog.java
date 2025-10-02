package com.cgdms.CGDMS.vegetables.croplog;


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
public class CropLog extends BaseEntity {
    private LocalDate date;
    private String cropStage; // germination, vegetative, flowering, etc.
    private Double irrigationL;
    private Double fertilizerG;
    private String pesticideApplied;
    private Long staffId;

    @ManyToOne
    @JoinColumn(name = "plot_id")
    private Plot plot;
}