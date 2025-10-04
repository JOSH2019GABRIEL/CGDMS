package com.cgdms.CGDMS.broiler.dailybroilerlogs;

import com.cgdms.CGDMS.base.BaseEntity;
import com.cgdms.CGDMS.broiler.flock.Flock;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;

import java.time.LocalDate;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@SuperBuilder
public class DailyBroilerLog extends BaseEntity {

    @Column(nullable = false)
    private LocalDate date;

    @ManyToOne(optional = false)
    @JoinColumn(name = "flock_id")
    private Flock flock;

    @Column(nullable = false)
    private String feedType;

    private Double feedQtyKg;

    private String waterCheck;  // true = ok, false = issue

    private Double temp;  // e.g., average temperature of house

    private Integer mortalityCount;

    private String notes;

}