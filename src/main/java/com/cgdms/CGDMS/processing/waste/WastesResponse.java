package com.cgdms.CGDMS.processing.waste;


import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class WastesResponse {

    private Long id;
    private Double inedibleWasteKg;
    private Double packagingWasteKg;
    private Double effluentEstimateKg;
    private String disposalMethod;

    private Long processId;
    private String plantLocation;  // from ProcessingBatch
    private String operator;       // from ProcessingBatch
}
