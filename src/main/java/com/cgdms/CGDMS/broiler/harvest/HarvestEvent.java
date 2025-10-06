package com.cgdms.CGDMS.broiler.harvest;


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
public class HarvestEvent extends BaseEntity {

    @Column(nullable = false)
    private LocalDate date;

    @ManyToOne(optional = false)
    @JoinColumn(name = "flock_id")
    private Flock flock;

    @Column(nullable = false)
    private Integer totalHarvested;

    private Double averageLiveWeight; // avg weight per bird

    private Integer cullCount; // rejected/unfit birds

//    @ManyToOne(optional = false)
//    @JoinColumn(name = "operator_id")
//    private User operator;
}