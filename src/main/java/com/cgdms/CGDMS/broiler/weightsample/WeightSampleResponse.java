package com.cgdms.CGDMS.broiler.weightsample;

import lombok.*;

import java.time.LocalDate;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class WeightSampleResponse {
    private Long id;
    private LocalDate date;
    private Long flockId;
    private Integer sampleCount;
    private Double avgWeightG;
    private Double sd;
    private Long operatorId;
}
