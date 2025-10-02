package com.cgdms.CGDMS.vegetables.postharvestloss;


import com.cgdms.CGDMS.base.BaseEntity;
import com.cgdms.CGDMS.vegetables.harvestBatch.HarvestBatch;
import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@SuperBuilder
public class PostharvestLoss extends BaseEntity {
    private Double spoilageKg;
    private Double trimmingWasteKg;
    private Double pestsDamageKg;

    @ManyToOne
    @JoinColumn(name = "harvest_id")
    private HarvestBatch harvestBatch;
}