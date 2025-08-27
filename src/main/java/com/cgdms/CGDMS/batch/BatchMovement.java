package com.cgdms.CGDMS.batch;

import com.cgdms.CGDMS.base.BaseEntity;
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
public class BatchMovement extends BaseEntity {

    @ManyToOne(optional = false, fetch = FetchType.LAZY)
    @JoinColumn(name = "batch_id", nullable = false)
    private Batch batch;

    @ManyToOne(optional = false, fetch = FetchType.LAZY)
    @JoinColumn(name = "from_pond_id", nullable = false)
    private Pond fromPond;

    @ManyToOne(optional = false, fetch = FetchType.LAZY)
    @JoinColumn(name = "to_pond_id", nullable = false)
    private Pond toPond;

    /** Date the movement happened (not just when it was recorded) */
    private LocalDate movementDate;

    /** Optional: number of fish moved (for audit). Not used to split batches in this simple flow. */
    private Integer movedCount;

    /** Optional reason/note */
    @Column(length = 500)
    private String reason;

//    @Id
//    @GeneratedValue(strategy = GenerationType.IDENTITY)
//    private Long id;
//    @ManyToOne(optional = false)
//    private Batch batch;
//    @ManyToOne private Pond fromPond;
//    @ManyToOne private Pond toPond;
//    private Integer movedCount;
//    private LocalDate date;
//    private String reason;
}
