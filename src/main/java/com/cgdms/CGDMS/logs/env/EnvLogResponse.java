package com.cgdms.CGDMS.logs.env;

import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EnvLogResponse {
    private Long id;
    private Long pondId;
    private String pondName;
    private LocalDateTime measuredAt;
    private Double temperatureC;
    private Double dissolvedOxygenMgL;
    private Double pH;
    private Double ammoniaMgL;
    private Double turbidityNtu;
    private Double salinityPpt;
    private Boolean fromSensor;
    private String notes;
}
