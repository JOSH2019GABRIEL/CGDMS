package com.cgdms.CGDMS.logs.env;


import com.cgdms.CGDMS.base.BaseEntity;
import com.cgdms.CGDMS.pond.Pond;
import com.cgdms.CGDMS.staff.Staff;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@SuperBuilder
public class EnvLog extends BaseEntity {

    @ManyToOne(optional = false, fetch = FetchType.LAZY)
    @JoinColumn(name = "pond_id", nullable = false)
    private Pond pond;

    @Column(nullable = false)
    private LocalDateTime measuredAt;

    private Double temperatureC;

    private Double dissolvedOxygenMgL;

    private Double pH;

    private Double ammoniaMgL;

    private Double turbidityNtu;

    private Double salinityPpt;

    @Column(length = 1000)
    private String notes;

    private Boolean fromSensor;

//    /** Optimistic locking */
//    @Version
//    private Long version;
}
