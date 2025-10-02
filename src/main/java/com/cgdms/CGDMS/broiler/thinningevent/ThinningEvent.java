package com.cgdms.CGDMS.broiler.thinningevent;


import com.cgdms.CGDMS.base.BaseEntity;
import com.cgdms.CGDMS.broiler.flock.Flock;
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
public class ThinningEvent extends BaseEntity {

    @Column(nullable = false)
    private LocalDate date;

    @ManyToOne(optional = false)
    @JoinColumn(name = "flock_id")
    private Flock flock;

    @Column(nullable = false)
    private Integer numberRemoved;

    private Double averageWeight; // per bird in kg or g

    private String destination;   // where the birds were moved/sold
    private Integer OperatorId;
}