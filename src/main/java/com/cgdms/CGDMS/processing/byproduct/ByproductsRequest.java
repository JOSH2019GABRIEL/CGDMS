package com.cgdms.CGDMS.processing.byproduct;

import jakarta.validation.constraints.NotNull;
import lombok.*;

@Getter
@Setter
@Builder
public class ByproductsRequest {

    private Long id;
    private Double liverKg;
    private Double gizzardKg;
    private Double heartKg;
    private Double bloodLtr;
    private Double feathersKg;

    private Long processingBatchId;
}