package com.cgdms.CGDMS.vegetables.plantingevent;

import com.cgdms.CGDMS.vegetables.crop.CropVariety;
import com.cgdms.CGDMS.vegetables.plots.Plot;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.*;

import java.time.LocalDate;


@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class PlantingEventResponse {

    private Long id;
    private String seedBatch;
    private Integer seedCount;
    private LocalDate date;
    private LocalDate expectedHarvestDate;

    private Long plotId;
    private Long cropId;
}
