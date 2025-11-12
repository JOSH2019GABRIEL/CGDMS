package com.cgdms.CGDMS.fishmanagement.service;

import com.cgdms.CGDMS.batch.Batch;
import com.cgdms.CGDMS.batch.BatchRepository;
import com.cgdms.CGDMS.common.AuthUtils;
import com.cgdms.CGDMS.common.PageResponse;
import com.cgdms.CGDMS.fishmanagement.entity.FishHarvest;
import com.cgdms.CGDMS.fishmanagement.entity.request.FishHarvestRequest;
import com.cgdms.CGDMS.fishmanagement.entity.response.FishHarvestResponse;
import com.cgdms.CGDMS.fishmanagement.repository.FishHarvestRepository;
import com.cgdms.CGDMS.fishmanagement.service.mapper.FishHarvestMapperService;
import com.cgdms.CGDMS.pond.Pond;
import com.cgdms.CGDMS.pond.PondRepository;
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
public class FishHarvestService {

    private final FishHarvestRepository fishHarvestRepository;
    private final PondRepository pondRepository;
    private final BatchRepository batchRepository;
    private final FishHarvestMapperService mapper;
    private final AuthUtils authUtils;


    public FishHarvestRequest saveFishHarvest(FishHarvestRequest fishHarvestRequest) {
        FishHarvest fishHarvest;
        Batch batch;
        Pond pond;


        if (fishHarvestRequest.getId() != null) {
            //update existing
            fishHarvest = fishHarvestRepository.findById(fishHarvestRequest.getId())
                    .orElseThrow(() -> new EntityNotFoundException("FishHarvest not found"));

            batch = batchRepository.findById(fishHarvestRequest.getBatchId())
                    .orElseThrow(() -> new EntityNotFoundException("Batch not found"));

            pond = pondRepository.findById(fishHarvestRequest.getPondId())
                    .orElseThrow(() -> new EntityNotFoundException("Pond not found"));


            fishHarvest.setHarvestDate(fishHarvestRequest.getHarvestDate());
            fishHarvest.setHarvestOfficer(null);
            fishHarvest.setProductionCycle(fishHarvest.getProductionCycle());
            fishHarvest.setTotalFishHarvested(fishHarvest.getTotalFishHarvested());
            fishHarvest.setAverageWeightKg(fishHarvestRequest.getAverageWeightKg());
            fishHarvest.setTotalWeightKg(fishHarvestRequest.getTotalWeightKg());
            fishHarvest.setMortalityDuringHarvest(fishHarvestRequest.getMortalityDuringHarvest());
            fishHarvest.setGradingCategory(fishHarvest.getGradingCategory());
            fishHarvest.setArchived(0);

            if (fishHarvestRequest.getPondId() != null) {
                fishHarvest.setPond(pond);
            }
            if (fishHarvestRequest.getBatchId() != null) {
                fishHarvest.setBatch(batch);
            }


        } else {
            fishHarvest = mapper.toHarvest(fishHarvestRequest);
        }

        fishHarvestRepository.save(fishHarvest);
        return fishHarvestRequest;
    }


    public PageResponse<FishHarvestResponse> findAllFishHarvest(int page, int size) {
        User loggedInUser = authUtils.getCurrentUser();
        boolean isAdmin = authUtils.isAdmin();
        Long farmId = authUtils.getCurrentUserFarmId();

        Pageable pageable = PageRequest.of(page, size, Sort.by("createdDate").descending());

        Page<FishHarvest> fishHarvests = isAdmin ? fishHarvestRepository.findAllNotArchived(pageable, farmId) : fishHarvestRepository.findAllNotArchivedForUsers(pageable, farmId, loggedInUser.getId());

        List<FishHarvestResponse> responses = fishHarvests.stream()
                .map(mapper::toHarvestResponse)
                .toList();

        return new PageResponse<>(
                responses,
                fishHarvests.getNumber(),
                fishHarvests.getSize(),
                fishHarvests.getTotalElements(),
                fishHarvests.getTotalPages(),
                fishHarvests.isFirst(),
                fishHarvests.isLast()
        );
    }

    public FishHarvestResponse findFishHarvestById(Long id) {
        return fishHarvestRepository.findById(id)
                .map(mapper::toHarvestResponse)
                .orElseThrow(() -> new EntityNotFoundException("FishHarvest not found"));
    }

    public void deleteFishHarvestById(Long id) {
        FishHarvest fishHarvest = fishHarvestRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("FishHarvest not found"));
        fishHarvest.setArchived(1);
        fishHarvestRepository.save(fishHarvest);
    }
}