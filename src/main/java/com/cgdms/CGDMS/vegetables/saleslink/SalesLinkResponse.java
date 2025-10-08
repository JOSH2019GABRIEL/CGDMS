package com.cgdms.CGDMS.vegetables.saleslink;

import lombok.*;


@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class SalesLinkResponse {

    private Long id;
    private String salesInvoice;
    private String marketDestination;
    private Long harvestBatchId;
}
