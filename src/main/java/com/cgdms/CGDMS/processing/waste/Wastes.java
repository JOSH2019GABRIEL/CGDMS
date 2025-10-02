package com.cgdms.CGDMS.processing.waste;


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
public class Wastes extends BaseEntity {
    private Double inedibleWasteKg;
    private Double packagingWasteKg;
    private Double effluentEstimateKg;
    private String disposalMethod;

    @ManyToOne
    @JoinColumn(name = "process_id")
    private ProcessingBatch processingBatch;
}