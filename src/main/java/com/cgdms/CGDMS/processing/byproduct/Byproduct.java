package com.cgdms.CGDMS.processing.byproduct;


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
public class Byproduct extends BaseEntity {
    private Double liverKg;
    private Double gizzardKg;
    private Double heartKg;
    private Double bloodLtr;
    private Double feathersKg;

    @ManyToOne
    @JoinColumn(name = "process_id")
    private ProcessingBatch processingBatch;
}