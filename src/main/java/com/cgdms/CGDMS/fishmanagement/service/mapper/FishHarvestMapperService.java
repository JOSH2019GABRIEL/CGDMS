package com.cgdms.CGDMS.fishmanagement.service.mapper;

import com.cgdms.CGDMS.batch.Batch;
import com.cgdms.CGDMS.batch.BatchRepository;
import com.cgdms.CGDMS.fishmanagement.entity.FishHarvest;
import com.cgdms.CGDMS.fishmanagement.entity.request.FishHarvestRequest;
import com.cgdms.CGDMS.fishmanagement.entity.response.FishHarvestResponse;
import com.cgdms.CGDMS.pond.Pond;
import com.cgdms.CGDMS.pond.PondRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class FishHarvestMapperService {

    @Autowired
    private BatchRepository batchRepository;

    @Autowired
    private PondRepository pondRepository;

    public FishHarvest toHarvest(FishHarvestRequest request) {
        Pond pond = pondRepository.findById(request.getPondId())
                .orElseThrow(() -> new RuntimeException("Pond not found with ID: " + request.getPondId()));

        Batch batch = batchRepository.findById(request.getBatchId())
                .orElseThrow(() -> new RuntimeException("Batch not found with ID: " + request.getBatchId()));

        return FishHarvest.builder()
                .pond(pond)
                .batch(batch)
                .harvestDate(request.getHarvestDate())
                .harvestOfficer(request.getHarvestOfficer())
                .productionCycle(request.getProductionCycle())
                .totalFishHarvested(request.getTotalFishHarvested())
                .averageWeightKg(request.getAverageWeightKg())
                .totalWeightKg(request.getTotalWeightKg())
                .mortalityDuringHarvest(request.getMortalityDuringHarvest())
                .gradingCategory(request.getGradingCategory())
                .archived(0)
                .build();
    }

    public FishHarvestResponse toHarvestResponse(FishHarvest harvest) {
        return FishHarvestResponse.builder()
                .id(harvest.getId())
                .pondName(harvest.getPond().getName())
                .batchNumber(harvest.getBatch().getId())
                .harvestDate(harvest.getHarvestDate())
                .harvestOfficer(harvest.getHarvestOfficer())
                .productionCycle(harvest.getProductionCycle())
                .totalFishHarvested(harvest.getTotalFishHarvested())
                .averageWeightKg(harvest.getAverageWeightKg())
                .totalWeightKg(harvest.getTotalWeightKg())
                .mortalityDuringHarvest(harvest.getMortalityDuringHarvest())
                .gradingCategory(harvest.getGradingCategory())
                .build();
    }
}
