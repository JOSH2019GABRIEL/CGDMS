package com.cgdms.CGDMS.vegetables.harvestBatch;

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
public class HarvestBatchResponse {

    private Long id;
    private LocalDate date;
    private Double harvestedQtyKg;
    private String marketGrade; // A / B / C
    private Double packedQtyKg;
    private String packType;
    private Long plotId;
}
