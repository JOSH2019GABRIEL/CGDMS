package com.cgdms.CGDMS.vegetables.saleslink;

import com.cgdms.CGDMS.vegetables.harvestBatch.HarvestBatch;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
public class SalesLinkRequest {

    private Long id;
    private String salesInvoice;
    private String marketDestination;
    private Long harvestBatchId;

}
