package com.cgdms.CGDMS.broiler.flock;

import com.cgdms.CGDMS.base.BaseEntity;
import com.cgdms.CGDMS.farm.Farm;
import com.fasterxml.jackson.annotation.JsonBackReference;
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
public class Flock extends BaseEntity {

//    @Column(nullable = false)
//    private String houseId;

    @Column(nullable = false)
    private String source;

    @Column(nullable = false)
    private LocalDate hatchDate;

    @Column(nullable = false)
    private Integer stockingCount;

    /**
     * Example: "50:50", "70:30"
     * Or store as percentage male/female
     */
    private String sexRatio;

    private Integer expectedCycleDays;

    private Double targetWeight;

    /**
     * JSON field or string representing vaccination schedule/profile
     * e.g., "Marek's (Day 1), NDV (Day 7), IBD (Day 14)"
     */
//    @Lob
    private String vaccineProfile;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "farm_id", nullable = false)
    @JsonBackReference // 👈 prevents recursion back to Farm
    private Farm farm;

}
