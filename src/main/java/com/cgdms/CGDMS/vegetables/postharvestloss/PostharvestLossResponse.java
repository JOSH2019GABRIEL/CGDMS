package com.cgdms.CGDMS.vegetables.postharvestloss;

import com.cgdms.CGDMS.vegetables.harvestBatch.HarvestBatch;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class PostharvestLossResponse {

    private Long id;
    private Double spoilageKg;
    private Double trimmingWasteKg;
    private Double pestsDamageKg;
    private Long harvestBatchId;
}
