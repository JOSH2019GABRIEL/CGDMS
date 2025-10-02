package com.cgdms.CGDMS.processing.byproduct;

import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ByproductsResponse {

    private Long id;
    private Double liverKg;
    private Double gizzardKg;
    private Double heartKg;
    private Double bloodLtr;
    private Double feathersKg;

    private Long processingBatchId;
    private String processingBatchCode; // optional, if you want extra info from ProcessingBatch
}