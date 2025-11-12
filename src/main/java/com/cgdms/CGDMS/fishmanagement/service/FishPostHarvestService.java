package com.cgdms.CGDMS.fishmanagement.service;


import com.cgdms.CGDMS.common.AuthUtils;
import com.cgdms.CGDMS.common.PageResponse;
import com.cgdms.CGDMS.fishmanagement.entity.FishHarvest;
import com.cgdms.CGDMS.fishmanagement.entity.PostHarvest;
import com.cgdms.CGDMS.fishmanagement.entity.request.FishPostHarvestRequest;
import com.cgdms.CGDMS.fishmanagement.entity.response.FishHarvestResponse;
import com.cgdms.CGDMS.fishmanagement.entity.response.FishPostHarvestResponse;
import com.cgdms.CGDMS.fishmanagement.repository.FishHarvestRepository;
import com.cgdms.CGDMS.fishmanagement.repository.FishPostHarvestRepository;
import com.cgdms.CGDMS.fishmanagement.service.mapper.FishPostHarvestMapperService;
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
public class FishPostHarvestService {


    private final FishHarvestRepository fishHarvestRepository;
    private final FishPostHarvestRepository postHarvestRepository;
    private final FishPostHarvestMapperService mapper;
    private final AuthUtils authUtils;


    public FishPostHarvestRequest saveFishPostHarvest(FishPostHarvestRequest request) {
        PostHarvest postHarvest;
        FishHarvest fishHarvest;

        if (request.getHarvestId() != null) {
            //update existing
            fishHarvest = fishHarvestRepository.findById(request.getHarvestId())
                    .orElseThrow(() -> new EntityNotFoundException("FishHarvest not found"));

            postHarvest = postHarvestRepository.findById(request.getId())
                    .orElseThrow(() -> new EntityNotFoundException("Post Harvest not found"));


            postHarvest.setDestinationType(request.getDestinationType());
            postHarvest.setQuantityToLiveSaleKg(request.getQuantityToLiveSaleKg());
            postHarvest.setQuantityToSmokingKg(request.getQuantityToSmokingKg());
            postHarvest.setDestinationBatchNo(request.getDestinationBatchNo());
            postHarvest.setTransferDate(request.getTransferDate());
            postHarvest.setArchived(0);

            if (request.getHarvestId() != null) {
                postHarvest.setHarvest(fishHarvest);
            }

        } else {
            postHarvest = mapper.toPostHarvest(request);
        }

        postHarvestRepository.save(postHarvest);
        return request;
    }


    public PageResponse<FishPostHarvestResponse> findAllFishPostHarvest(int page, int size) {
        User loggedInUser = authUtils.getCurrentUser();
        boolean isAdmin = authUtils.isAdmin();
        Long farmId = authUtils.getCurrentUserFarmId();

        Pageable pageable = PageRequest.of(page, size, Sort.by("createdDate").descending());

        Page<PostHarvest> fishPostHarvests = isAdmin ? postHarvestRepository.findAllNotArchived(pageable, farmId) : postHarvestRepository.findAllNotArchivedForUsers(pageable, farmId, loggedInUser.getId());

        List<FishPostHarvestResponse> responses = fishPostHarvests.stream()
                .map(mapper::toFishPostHarvestResponse)
                .toList();

        return new PageResponse<>(
                responses,
                fishPostHarvests.getNumber(),
                fishPostHarvests.getSize(),
                fishPostHarvests.getTotalElements(),
                fishPostHarvests.getTotalPages(),
                fishPostHarvests.isFirst(),
                fishPostHarvests.isLast()
        );
    }

    public FishPostHarvestResponse findFishHarvestById(Long id) {
        return postHarvestRepository.findById(id)
                .map(mapper::toFishPostHarvestResponse)
                .orElseThrow(() -> new EntityNotFoundException("FishHarvest not found"));
    }

    public void deleteFishHarvestById(Long id) {
        PostHarvest fishPostHarvest = postHarvestRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("FishHarvest not found"));
        fishPostHarvest.setArchived(1);
        postHarvestRepository.save(fishPostHarvest);
    }
}
