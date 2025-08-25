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
public class BatchMovement {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @ManyToOne(optional = false) private Batch batch;
    @ManyToOne private Pond fromPond;
    @ManyToOne private Pond toPond;
    private Integer movedCount;
    private LocalDate date;
    private String reason;
}
