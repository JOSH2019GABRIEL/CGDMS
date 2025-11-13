package com.cgdms.CGDMS.fishmanagement.service;

import com.cgdms.CGDMS.common.AuthUtils;
import com.cgdms.CGDMS.common.PageResponse;
import com.cgdms.CGDMS.fishmanagement.entity.LiveSalesDetails;
import com.cgdms.CGDMS.fishmanagement.entity.PostHarvest;
import com.cgdms.CGDMS.fishmanagement.entity.request.LiveSalesRequest;
import com.cgdms.CGDMS.fishmanagement.entity.response.LiveSalesResponse;
import com.cgdms.CGDMS.fishmanagement.repository.FishPostHarvestRepository;
import com.cgdms.CGDMS.fishmanagement.repository.LiveSalesRepository;
import com.cgdms.CGDMS.fishmanagement.service.mapper.LiveSalesMapperService;
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
public class LiveSalesDetailsService {

    private final AuthUtils authUtils;
    private final FishPostHarvestRepository postHarvestRepository;
    private final LiveSalesMapperService mapper;
    private final LiveSalesRepository liveSalesRepository;



    public LiveSalesRequest saveFishSales(LiveSalesRequest request) {
        PostHarvest postHarvest;
        LiveSalesDetails liveSalesDetails;

        if (request.getId() != null) {
            //update existing
            postHarvest = postHarvestRepository.findById(request.getId())
                    .orElseThrow(() -> new EntityNotFoundException("Post Harvest not found"));

            liveSalesDetails = liveSalesRepository.findById(request.getId())
                                .orElseThrow(() -> new EntityNotFoundException("Live Sales not found"));


            liveSalesDetails.setBuyerName(request.getBuyName());
            liveSalesDetails.setSalePricePerKg(request.getSalePricePerKg());
            liveSalesDetails.setTotalSaleValue(request.getTotalSaleValue());
            liveSalesDetails.setPaymentStatus(request.getPaymentStatus());
            liveSalesDetails.setInvoiceNo(request.getInvoiceNo());
            liveSalesDetails.setDispatchMethod(request.getDispatchMethod());
            liveSalesDetails.setArchived(0);

            if (request.getPostHarvestId() != null) {
                liveSalesDetails.setPostHarvestDestination(postHarvest);
            }

        } else {
            liveSalesDetails = mapper.toEntity(request);
        }

        liveSalesRepository.save(liveSalesDetails);
        return request;
    }


    public PageResponse<LiveSalesResponse> findAllLiveSalesDetails(int page, int size) {
        User loggedInUser = authUtils.getCurrentUser();
        boolean isAdmin = authUtils.isAdmin();
        Long farmId = authUtils.getCurrentUserFarmId();

        Pageable pageable = PageRequest.of(page, size, Sort.by("createdDate").descending());

        Page<LiveSalesDetails> liveSalesDetails = isAdmin ? liveSalesRepository.findAllNotArchived(pageable, farmId) : liveSalesRepository.findAllNotArchivedForUsers(pageable, farmId, loggedInUser.getId());

        List<LiveSalesResponse> responses = liveSalesDetails.stream()
                .map(mapper::toResponse)
                .toList();

        return new PageResponse<>(
                responses,
                liveSalesDetails.getNumber(),
                liveSalesDetails.getSize(),
                liveSalesDetails.getTotalElements(),
                liveSalesDetails.getTotalPages(),
                liveSalesDetails.isFirst(),
                liveSalesDetails.isLast()
        );
    }

    public LiveSalesResponse findLiveSalesDetailById(Long id) {
        return liveSalesRepository.findById(id)
                .map(mapper::toResponse)
                .orElseThrow(() -> new EntityNotFoundException("Live sales details not found"));
    }

    public void deleteLiveSalesDetailById(Long id) {
        LiveSalesDetails liveSalesDetails = liveSalesRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Live sales details not found"));
        liveSalesDetails.setArchived(1);
        liveSalesRepository.save(liveSalesDetails);
    }
}
