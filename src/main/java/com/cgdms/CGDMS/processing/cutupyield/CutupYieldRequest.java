package com.cgdms.CGDMS.processing.cutupyield;

import jakarta.validation.constraints.NotNull;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
public class CutupYieldRequest {

    private Long id;
    private Integer wholeBirdsCount;
    private Double breastKg;
    private Double thighKg;
    private Double wingKg;
    private Double drumstickKg;
    private Double carcassKg;

    private Long processingBatchId;
}