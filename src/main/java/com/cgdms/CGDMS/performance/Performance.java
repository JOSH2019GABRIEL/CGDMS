package com.cgdms.CGDMS.performance;


import com.cgdms.CGDMS.base.BaseEntity;
import com.cgdms.CGDMS.batch.Batch;
import com.cgdms.CGDMS.pond.Pond;
import jakarta.persistence.*;
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
public class Performance extends BaseEntity {

    private LocalDate date;
    @ManyToOne
    private Pond pond;
    @ManyToOne
    private Batch batch;
    private Double avgWeightG;
    private Integer liveCount;
    private Double biomassKg;
}
