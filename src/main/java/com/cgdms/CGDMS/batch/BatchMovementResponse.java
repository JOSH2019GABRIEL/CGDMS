package com.cgdms.CGDMS.batch;

import lombok.*;

import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BatchMovementResponse {
    private Long id;

    private Long batchId;
    private String batchSource;       // from Batch.source (nice to show)
    private Long fromPondId;
    private String fromPondName;
    private Long toPondId;
    private String toPondName;

    private LocalDate movementDate;
    private Integer movedCount;
    private String reason;

}
