package com.cgdms.CGDMS.processing.slaughterlog;

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
public class SlaughterLog extends BaseEntity {
    private Integer birdsReceived;
    private Integer birdsSlaughtered;
    private Integer condemnedCount;
    private String reason;

    @ManyToOne
    @JoinColumn(name = "process_id")
    private ProcessingBatch processingBatch;
}