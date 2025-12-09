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
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.apache.coyote.BadRequestException;
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


    @Transactional
    public FishHarvestRequest saveFishHarvest(FishHarvestRequest req) throws BadRequestException {

        FishHarvest harvest;
        Pond pond = pondRepository.findById(req.getPondId())
                .orElseThrow(() -> new EntityNotFoundException("Pond not found"));

        if (req.getId() != null) {

            harvest = fishHarvestRepository.findById(req.getId())
                    .orElseThrow(() -> new EntityNotFoundException("FishHarvest not found"));
            pond.setAvailableFingerlin(
                    pond.getAvailableFingerlin() - req.getTotalFishHarvested()
            );

            // Update the harvest record
            harvest.setHarvestDate(req.getHarvestDate());
            harvest.setHarvestOfficer(req.getHarvestOfficer());
            harvest.setProductionCycle(harvest.getProductionCycle()); // Keep unchanged
            harvest.setTotalFishHarvested(req.getTotalFishHarvested());
            harvest.setAverageWeightKg(req.getAverageWeightKg());
            harvest.setTotalWeightKg(req.getTotalWeightKg());
            harvest.setMortalityDuringHarvest(req.getMortalityDuringHarvest());
            harvest.setGradingCategory(harvest.getGradingCategory());
            harvest.setArchived(0);
            harvest.setPond(pond);

        }
        else {

            harvest = mapper.toHarvest(req);

            // Deduct harvested fish from pond
            int remaining = pond.getAvailableFingerlin() - req.getTotalFishHarvested();

            if (remaining < 0) {
                throw new BadRequestException("Harvest exceeds available fingerlings in pond." + pond.getAvailableFingerlin() + " and trying to harvest: " + req.getTotalFishHarvested());
            }

            pond.setAvailableFingerlin(remaining);
            harvest.setPond(pond);
            harvest.setArchived(0);
        }

        // Save pond & harvest
        pondRepository.save(pond);
        fishHarvestRepository.save(harvest);

        return req;
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