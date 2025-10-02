package com.cgdms.CGDMS.vegetables.saleslink;


import com.cgdms.CGDMS.base.BaseEntity;
import com.cgdms.CGDMS.vegetables.harvestBatch.HarvestBatch;
import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@SuperBuilder
public class SalesLink extends BaseEntity {
    private String salesInvoice;
    private String marketDestination;

    @OneToOne
    @JoinColumn(name = "harvest_id")
    private HarvestBatch harvestBatch;
}