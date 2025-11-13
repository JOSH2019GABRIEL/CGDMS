package com.cgdms.CGDMS.fishmanagement.service.mapper;

import com.cgdms.CGDMS.fishmanagement.entity.LiveSalesDetails;
import com.cgdms.CGDMS.fishmanagement.entity.PostHarvest;
import com.cgdms.CGDMS.fishmanagement.entity.request.LiveSalesRequest;
import com.cgdms.CGDMS.fishmanagement.entity.response.LiveSalesResponse;
import com.cgdms.CGDMS.fishmanagement.repository.FishPostHarvestRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class LiveSalesMapperService {

    private final FishPostHarvestRepository fishPostHarvestRepository;


    public LiveSalesDetails toEntity(LiveSalesRequest request) {

        PostHarvest postHarvest = fishPostHarvestRepository.findById(request.getPostHarvestId())
                .orElseThrow(()-> new EntityNotFoundException("Post Harvest not found!"));

        return LiveSalesDetails.builder()
                .id(request.getId())
                .postHarvestDestination(postHarvest)
                .buyerName(request.getBuyName())
                .salePricePerKg(request.getSalePricePerKg())
                .totalSaleValue(request.getTotalSaleValue())
                .paymentStatus(request.getPaymentStatus())
                .invoiceNo(request.getInvoiceNo())
                .dispatchMethod(request.getDispatchMethod())
                .quantitySale(request.getQuantitySale())
                .archived(0)
                .build();
    }

    public LiveSalesResponse toResponse(LiveSalesDetails entity) {

        return LiveSalesResponse.builder()
                .id(entity.getId())
                .postHarvestId(entity.getPostHarvestDestination() != null ? entity.getPostHarvestDestination().getId() : null)
                .buyName(entity.getBuyerName())
                .salePricePerKg(entity.getSalePricePerKg())
                .totalSaleValue(entity.getTotalSaleValue())
                .paymentStatus(entity.getPaymentStatus())
                .invoiceNo(entity.getInvoiceNo())
                .dispatchMethod(entity.getDispatchMethod())
                .quantitySale(entity.getQuantitySale())
                .build();
    }
}
