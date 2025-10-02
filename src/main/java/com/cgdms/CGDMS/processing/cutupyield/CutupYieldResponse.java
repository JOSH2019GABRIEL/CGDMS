package com.cgdms.CGDMS.processing.cutupyield;

import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class CutupYieldResponse {

    private Long id;
    private Integer wholeBirdsCount;
    private Double breastKg;
    private Double thighKg;
    private Double wingKg;
    private Double drumstickKg;
    private Double carcassKg;

    private Long processingBatchId;
    private String processingBatchCode; // optional: if you want to expose batch details
}