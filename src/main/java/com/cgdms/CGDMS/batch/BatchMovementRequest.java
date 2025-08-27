package com.cgdms.CGDMS.batch;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BatchMovementRequest {

    private Long id; // null for create, set for update (if you allow updates)

    @NotNull(message = "batchId is required")
    private Long batchId;

    @NotNull(message = "fromPondId is required")
    private Long fromPondId;

    @NotNull(message = "toPondId is required")
    private Long toPondId;

    @NotNull(message = "movementDate is required")
    private LocalDate movementDate;

    @Min(value = 0, message = "movedCount must be >= 0")
    private Integer movedCount;

    private String reason;
}