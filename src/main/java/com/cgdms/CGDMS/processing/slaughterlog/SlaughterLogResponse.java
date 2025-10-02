package com.cgdms.CGDMS.processing.slaughterlog;


import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class SlaughterLogResponse {

    private Long id;
    private Integer birdsReceived;
    private Integer birdsSlaughtered;
    private Integer condemnedCount;
    private String reason;

    private Long processId;
    private String plantLocation;  // comes from ProcessingBatch
    private String operator;       // comes from ProcessingBatch
}
