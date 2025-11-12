package com.cgdms.CGDMS.fishmanagement.entity.response;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class SmokingPlantTransferResponse {

    private Long id;
    private Long postHarvestId;
    private String smokingBatchId;
    private Double quantityReceivedKg;
    private Double processingLossKg;
    private Double smokedOutputKg;
    private String transferNoteNo;
    private String qcInspectionStatus;

}
