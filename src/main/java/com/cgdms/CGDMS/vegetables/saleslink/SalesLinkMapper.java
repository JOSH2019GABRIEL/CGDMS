package com.cgdms.CGDMS.vegetables.saleslink;

import com.cgdms.CGDMS.vegetables.harvestBatch.HarvestBatch;
import org.springframework.stereotype.Service;

@Service
public class SalesLinkMapper {

    public SalesLink toEntity(SalesLinkRequest request, HarvestBatch harvest) {
        if (request == null) return null;

        return SalesLink.builder()
                .salesInvoice(request.getSalesInvoice())
                .marketDestination(request.getMarketDestination())
                .harvestBatch(harvest)
                .build();
    }

    public SalesLinkResponse toResponse(SalesLink entity) {
        if (entity == null) return null;

        return SalesLinkResponse.builder()
                .id(entity.getId())
                .salesInvoice(entity.getSalesInvoice())
                .marketDestination(entity.getMarketDestination())
                .harvestBatchId(entity.getHarvestBatch() != null ? entity.getHarvestBatch().getId() : null)
                .build();
    }
}