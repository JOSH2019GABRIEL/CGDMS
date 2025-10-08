package com.cgdms.CGDMS.vegetables.plantingevent;

import com.cgdms.CGDMS.vegetables.crop.CropVariety;
import com.cgdms.CGDMS.vegetables.plots.Plot;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
@Builder
public class PlantingEventRequest {

    private Long id;
    private String seedBatch;
    private Integer seedCount;
    private LocalDate date;
    private LocalDate expectedHarvestDate;

    private Long plotId;
    private Long cropId;
}
