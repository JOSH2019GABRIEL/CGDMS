package com.cgdms.CGDMS.fishmanagement.entity;


import com.cgdms.CGDMS.base.BaseEntity;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

import java.math.BigDecimal;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@SuperBuilder
@Table(name = "smoking_plant_transfer")
public class SmokingPlantTransferDetails extends BaseEntity {


    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "destination_id", nullable = false)
    private PostHarvest postHarvestDestination;

    @Column(name = "smoking_batch_id", length = 100, nullable = false)
    private String smokingBatchId; // Linked smoking plant batch number

    @Column(name = "quantity_received_kg")
    private Double quantityReceivedKg; // Verified weight at smoking plant

    @Column(name = "processing_loss_kg")
    private Double processingLossKg; // Weight loss due to drying/smoking

    @Column(name = "smoked_output_kg")
    private Double smokedOutputKg; // Final weight of smoked product

    @Column(name = "transfer_note_no", length = 100)
    private String transferNoteNo; // Internal logistics reference

    @Column(name = "qc_inspection_status", length = 50)
    private String qcInspectionStatus; // Quality control passed/failed
}