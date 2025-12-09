package com.cgdms.CGDMS.fishmanagement.service.mapper;

import com.cgdms.CGDMS.fishmanagement.entity.FishHarvest;
import com.cgdms.CGDMS.fishmanagement.entity.PostHarvest;
import com.cgdms.CGDMS.fishmanagement.entity.request.FishPostHarvestRequest;
import com.cgdms.CGDMS.fishmanagement.entity.response.FishPostHarvestResponse;
import com.cgdms.CGDMS.fishmanagement.repository.FishHarvestRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class FishPostHarvestMapperService {

    private final FishHarvestRepository fishHarvestRepository;


    public PostHarvest toPostHarvest(FishPostHarvestRequest request) {

        FishHarvest fishHarvest = fishHarvestRepository.findById(request.getHarvestId())
                .orElseThrow(() -> new RuntimeException("Harvest does not exist"));

        return PostHarvest.builder()
                .id(request.getId())
                .destinationType(request.getDestinationType())
                .quantityToLiveSaleKg(request.getQuantityToLiveSaleKg())
                .quantityToSmokingKg(request.getQuantityToSmokingKg())
                .destinationBatchNo(request.getDestinationBatchNo())
                .transferDate(request.getTransferDate())
                .harvest(fishHarvest)
                .postHarvestBatchId(request.getPostHarvestBatchId())
                .archived(0)
                .build();
    }

    public FishPostHarvestResponse toFishPostHarvestResponse(PostHarvest postHarvest) {
        return FishPostHarvestResponse.builder()
                .id(postHarvest.getId())
                .destinationType(postHarvest.getDestinationType())
                .quantityToLiveSaleKg(postHarvest.getQuantityToLiveSaleKg())
                .quantityToSmokingKg(postHarvest.getQuantityToSmokingKg())
                .destinationBatchNo(postHarvest.getDestinationBatchNo())
                .transferDate(postHarvest.getTransferDate())
                .harvestId(postHarvest.getHarvest() != null ? postHarvest.getHarvest().getHarvestBatchId() : null)
                .postHarvestBatchId(postHarvest.getPostHarvestBatchId())
                .build();
    }
}
