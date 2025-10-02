package com.cgdms.CGDMS.broiler.harvest;

import lombok.*;

import java.time.LocalDate;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class HarvestEventResponse {
    private Long id;
    private LocalDate date;
    private Long flockId;
    private Integer totalHarvested;
    private Double averageLiveWeight;
    private Integer cullCount;
    private Long operatorId;
}
