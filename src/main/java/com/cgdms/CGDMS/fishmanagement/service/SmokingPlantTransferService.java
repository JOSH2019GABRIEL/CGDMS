package com.cgdms.CGDMS.fishmanagement.service;

import com.cgdms.CGDMS.common.AuthUtils;
import com.cgdms.CGDMS.common.PageResponse;
import com.cgdms.CGDMS.fishmanagement.entity.LiveSalesDetails;
import com.cgdms.CGDMS.fishmanagement.entity.PostHarvest;
import com.cgdms.CGDMS.fishmanagement.entity.SmokingPlantTransferDetails;
import com.cgdms.CGDMS.fishmanagement.entity.request.LiveSalesRequest;
import com.cgdms.CGDMS.fishmanagement.entity.request.SmokingPlantTransferRequest;
import com.cgdms.CGDMS.fishmanagement.entity.response.LiveSalesResponse;
import com.cgdms.CGDMS.fishmanagement.entity.response.SmokingPlantTransferResponse;
import com.cgdms.CGDMS.fishmanagement.repository.FishPostHarvestRepository;
import com.cgdms.CGDMS.fishmanagement.repository.LiveSalesRepository;
import com.cgdms.CGDMS.fishmanagement.repository.SmokingPlantTransferRepository;
import com.cgdms.CGDMS.fishmanagement.service.mapper.LiveSalesMapperService;
import com.cgdms.CGDMS.fishmanagement.service.mapper.SmokingPlantTransferMapperService;
import com.cgdms.CGDMS.user.User;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class SmokingPlantTransferService {

    private final AuthUtils authUtils;
    private final SmokingPlantTransferRepository smokingPlantTransferRepository;
    private final SmokingPlantTransferMapperService mapper;
    private final FishPostHarvestRepository postHarvestRepository;



    public SmokingPlantTransferRequest saveSmokingTransfer (SmokingPlantTransferRequest request) {
        PostHarvest postHarvest;
        SmokingPlantTransferDetails transferDetails;

        if (request.getId() != null) {
            //update existing
            postHarvest = postHarvestRepository.findById(request.getPostHarvestId())
                    .orElseThrow(() -> new EntityNotFoundException("Post Harvest not found"));

            transferDetails = smokingPlantTransferRepository.findById(request.getId())
                    .orElseThrow(() -> new EntityNotFoundException("Smoking details not found"));


            transferDetails.setSmokingBatchId(request.getSmokingBatchId());
            transferDetails.setQuantityReceivedKg(request.getQuantityReceivedKg());
            transferDetails.setProcessingLossKg(request.getProcessingLossKg());
            transferDetails.setSmokedOutputKg(request.getSmokedOutputKg());
            transferDetails.setTransferNoteNo(request.getTransferNoteNo());
            transferDetails.setQcInspectionStatus(request.getQcInspectionStatus());
            transferDetails.setArchived(0);

            if (request.getPostHarvestId() != null) {
                transferDetails.setPostHarvestDestination(postHarvest);
            }

        } else {
            transferDetails = mapper.toEntity(request);
        }

        smokingPlantTransferRepository.save(transferDetails);
        return request;
    }


    public PageResponse<SmokingPlantTransferResponse> findAllSmokingPlants(int page, int size) {
        User loggedInUser = authUtils.getCurrentUser();
        boolean isAdmin = authUtils.isAdmin();
        Long farmId = authUtils.getCurrentUserFarmId();

        Pageable pageable = PageRequest.of(page, size, Sort.by("createdDate").descending());

        Page<SmokingPlantTransferDetails> transferDetails = isAdmin ? smokingPlantTransferRepository.findAllNotArchived(pageable, farmId) : smokingPlantTransferRepository.findAllNotArchivedForUsers(pageable, farmId, loggedInUser.getId());

        List<SmokingPlantTransferResponse> responses = transferDetails.stream()
                .map(mapper::toResponse)
                .toList();

        return new PageResponse<>(
                responses,
                transferDetails.getNumber(),
                transferDetails.getSize(),
                transferDetails.getTotalElements(),
                transferDetails.getTotalPages(),
                transferDetails.isFirst(),
                transferDetails.isLast()
        );
    }

    public SmokingPlantTransferResponse findSmokingPlantsById(Long id) {
        return smokingPlantTransferRepository.findById(id)
                .map(mapper::toResponse)
                .orElseThrow(() -> new EntityNotFoundException("Smoking details not found"));
    }

    public void deleteSmokePlantById(Long id) {
        SmokingPlantTransferDetails smokingPlantTransferDetails = smokingPlantTransferRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Live sales details not found"));
        smokingPlantTransferDetails.setArchived(1);
        smokingPlantTransferRepository.save(smokingPlantTransferDetails);
    }
}
