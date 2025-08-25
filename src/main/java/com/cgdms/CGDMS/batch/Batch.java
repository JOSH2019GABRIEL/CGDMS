package com.cgdms.CGDMS.batch;


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
public class Batch {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @ManyToOne(optional = false)
    private Pond pond;
    private String source;
    private LocalDate stockDate;
    private Double initialAvgWeightG;
    private Integer initialCount;
}
