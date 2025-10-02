package com.cgdms.CGDMS.processing.cutupyield;

import com.cgdms.CGDMS.base.BaseEntity;
import com.cgdms.CGDMS.processing.processingbatch.ProcessingBatch;
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
public class CutupYield extends BaseEntity {
    private Integer wholeBirdsCount;
    private Double breastKg;
    private Double thighKg;
    private Double wingKg;
    private Double drumstickKg;
    private Double carcassKg;

    @ManyToOne
    @JoinColumn(name = "process_id")
    private ProcessingBatch processingBatch;
}
