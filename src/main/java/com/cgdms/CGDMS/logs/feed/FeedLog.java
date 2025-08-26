package com.cgdms.CGDMS.logs.feed;


import com.cgdms.CGDMS.batch.Batch;
import com.cgdms.CGDMS.pond.Pond;
import com.cgdms.CGDMS.staff.Staff;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

import java.time.LocalDate;
import java.time.LocalTime;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@SuperBuilder
public class FeedLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private LocalDate date;
    @ManyToOne
    private Pond pond;
    @ManyToOne
    private Batch batch;
    private String feedType;
    private String brand;
    private Double quantityKg;
    private String method;
    private LocalTime timeOfDay;
    @ManyToOne
    private Staff staff;
}
