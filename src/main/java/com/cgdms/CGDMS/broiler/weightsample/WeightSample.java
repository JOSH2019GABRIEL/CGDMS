package com.cgdms.CGDMS.broiler.weightsample;

import com.cgdms.CGDMS.base.BaseEntity;
import com.cgdms.CGDMS.broiler.flock.Flock;
import com.cgdms.CGDMS.user.User;
import jakarta.persistence.Column;
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
public class WeightSample extends BaseEntity {

    @Column(nullable = false)
    private LocalDate date;

    @ManyToOne(optional = false)
    @JoinColumn(name = "flock_id")
    private Flock flock;

    @Column(nullable = false)
    private Integer sampleCount;   // number of birds sampled

    @Column(nullable = false)
    private Double avgWeightG;     // average weight in grams

    private Double sd;             // standard deviation of sample weights

    @ManyToOne(optional = false)
    @JoinColumn(name = "operator_id")
    private User operator;         // staff who took the sample
}