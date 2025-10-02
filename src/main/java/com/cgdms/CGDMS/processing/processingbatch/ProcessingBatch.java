package com.cgdms.CGDMS.processing.processingbatch;

import com.cgdms.CGDMS.base.BaseEntity;
import com.cgdms.CGDMS.broiler.harvest.HarvestEvent;
import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

import java.time.LocalDate;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@SuperBuilder
public class ProcessingBatch extends BaseEntity {
    private LocalDate date;
    private String plantLocation;
    private String operator;

    @ManyToOne
    @JoinColumn(name = "harvest_event_id")
    private HarvestEvent harvestEvent;
}