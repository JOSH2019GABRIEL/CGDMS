package com.cgdms.CGDMS.fishmanagement.service.mapper;

import com.cgdms.CGDMS.fishmanagement.entity.PostHarvest;
import com.cgdms.CGDMS.fishmanagement.entity.SmokingPlantTransferDetails;
import com.cgdms.CGDMS.fishmanagement.entity.request.SmokingPlantTransferRequest;
import com.cgdms.CGDMS.fishmanagement.entity.response.SmokingPlantTransferResponse;
import com.cgdms.CGDMS.fishmanagement.repository.FishPostHarvestRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class SmokingPlantTransferMapperService {

    private final FishPostHarvestRepository fishPostHarvestRepository;


    public SmokingPlantTransferDetails toEntity(SmokingPlantTransferRequest request) {

        PostHarvest postHarvest = fishPostHarvestRepository.findById(request.getPostHarvestId())
                .orElseThrow(()-> new EntityNotFoundException("Post Harvest not found!"));

        return SmokingPlantTransferDetails.builder()
                .id(request.getId())
                .postHarvestDestination(postHarvest)
                .smokingBatchId(request.getSmokingBatchId())
                .quantityReceivedKg(request.getQuantityReceivedKg())
                .processingLossKg(request.getProcessingLossKg())
                .smokedOutputKg(request.getSmokedOutputKg())
                .transferNoteNo(request.getTransferNoteNo())
                .qcInspectionStatus(request.getQcInspectionStatus())
                .archived(0)
                .build();
    }

    public SmokingPlantTransferResponse toResponse(SmokingPlantTransferDetails entity) {

        return SmokingPlantTransferResponse.builder()
                .id(entity.getId())
                .postHarvestId(entity.getPostHarvestDestination() != null ? entity.getPostHarvestDestination().getId() : null)
                .smokingBatchId(entity.getSmokingBatchId())
                .quantityReceivedKg(entity.getQuantityReceivedKg())
                .processingLossKg(entity.getProcessingLossKg())
                .smokedOutputKg(entity.getSmokedOutputKg())
                .transferNoteNo(entity.getTransferNoteNo())
                .qcInspectionStatus(entity.getQcInspectionStatus())
                .build();

    }
}
