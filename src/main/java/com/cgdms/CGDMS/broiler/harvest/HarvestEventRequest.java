package com.cgdms.CGDMS.broiler.harvest;

import com.cgdms.CGDMS.user.User;
import lombok.*;

import java.time.LocalDate;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class HarvestEventRequest {
    private Long id;
    private LocalDate date;
    private Long flockId;
    private Integer totalHarvested;
    private Double averageLiveWeight;
    private Integer cullCount;
    private User operatorId;
}
