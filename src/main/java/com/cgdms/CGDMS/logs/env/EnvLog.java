package com.cgdms.CGDMS.logs.env;


import com.cgdms.CGDMS.pond.Pond;
import com.cgdms.CGDMS.staff.Staff;
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
public class EnvLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private LocalDate date;
    @ManyToOne
    private Pond pond;
    private Double tempC;
    private Double ph;
    private Double doMgL;
    private Double ammoniaMgL;
    @ManyToOne
    private Staff capturedBy;
}
