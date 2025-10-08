package com.cgdms.CGDMS.vegetables.postharvestloss;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
public class PostharvestLossRequest {

    private Long id;
    private Double spoilageKg;
    private Double trimmingWasteKg;
    private Double pestsDamageKg;

    private Long harvestBatchId;
}
