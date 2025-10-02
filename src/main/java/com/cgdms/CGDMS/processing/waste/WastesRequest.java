package com.cgdms.CGDMS.processing.waste;


import jakarta.validation.constraints.NotNull;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
public class WastesRequest {

    private Long id;
    private Double inedibleWasteKg;
    private Double packagingWasteKg;
    private Double effluentEstimateKg;
    private String disposalMethod;

    @NotNull(message = "Processing Batch ID is required")
    private Long processId;
}
