package com.cgdms.CGDMS.logs.env;

import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EnvLogRequest {


    private Long id; // present for update

    @NotNull(message = "pondId is required")
    private Long pondId;

    @NotNull(message = "measuredAt is required")
    private LocalDateTime measuredAt;

    @DecimalMin(value = "-10.0", message = "temperatureC looks invalid")
    @DecimalMax(value = "50.0", message = "temperatureC looks invalid")
    private Double temperatureC;

    @DecimalMin(value = "0.0", message = "dissolvedOxygenMgL must be >= 0")
    private Double dissolvedOxygenMgL;

    @DecimalMin(value = "0.0", message = "pH must be >= 0")
    @DecimalMax(value = "14.0", message = "pH must be <= 14")
    private Double pH;

    @DecimalMin(value = "0.0", message = "ammoniaMgL must be >= 0")
    private Double ammoniaMgL;

    @DecimalMin(value = "0.0", message = "turbidityNtu must be >= 0")
    private Double turbidityNtu;

    @DecimalMin(value = "0.0", message = "salinityPpt must be >= 0")
    private Double salinityPpt;

    private Boolean fromSensor;

    @Size(max = 1000)
    private String notes;
}