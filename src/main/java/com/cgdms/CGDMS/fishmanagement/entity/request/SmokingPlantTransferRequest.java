package com.cgdms.CGDMS.fishmanagement.entity.request;

import lombok.Data;

@Data
public class SmokingPlantTransferRequest {

    private Long id;
    private Long postHarvestId;
    private String smokingBatchId;
    private Double quantityReceivedKg;
    private Double processingLossKg;
    private Double smokedOutputKg;
    private String transferNoteNo;
    private String qcInspectionStatus;
}
