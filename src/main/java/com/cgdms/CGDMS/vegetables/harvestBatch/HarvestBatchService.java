package com.cgdms.CGDMS.vegetables.harvestBatch;


import com.cgdms.CGDMS.common.PageResponse;
import com.cgdms.CGDMS.vegetables.plots.Plot;
import com.cgdms.CGDMS.vegetables.plots.PlotRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class HarvestBatchService {

    @Autowired
    private HarvestBatchRepository harvestBatchRepository;

    @Autowired
    private PlotRepository plotRepository;

    @Autowired
    private HarvestBatchMapper mapper;


    public HarvestBatchRequest saveHarvest(HarvestBatchRequest request) {
        HarvestBatch batch;
        Plot plot = null;

        if (request.getId() != null) {
            batch = harvestBatchRepository.findById(request.getId())
                    .orElseThrow(() -> new EntityNotFoundException("Harvest batch not found with id: " + request.getId()));

            if (request.getPlotId() != null){
                plot = plotRepository.findById(request.getPlotId())
                        .orElseThrow(()-> new EntityNotFoundException("Harvest batch not found with id: " + request.getPlotId()));
            }
            batch.setPlot(plot);
            batch.setDate(request.getDate());
            batch.setHarvestedQtyKg(request.getHarvestedQtyKg());
            batch.setMarketGrade(request.getMarketGrade());
            batch.setPackedQtyKg(request.getPackedQtyKg());
            batch.setPackType(request.getPackType());
        } else {
            batch = mapper.toEntity(request, plot);
        }

        batch.setArchived(0);
        harvestBatchRepository.save(batch);
        return request;
    }

    public PageResponse<HarvestBatchResponse> findAll(int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("date").descending());
        Page<HarvestBatch> batches = harvestBatchRepository.findAllNotArchived(pageable);
        List<HarvestBatchResponse> responses = batches.stream().map(mapper::toResponse).toList();
        return new PageResponse<>(responses, batches.getNumber(), batches.getSize(),
                batches.getTotalElements(), batches.getTotalPages(), batches.isFirst(), batches.isLast());
    }

    public HarvestBatchResponse findById(Long id) {
        return harvestBatchRepository.findById(id)
                .map(mapper::toResponse)
                .orElseThrow(() -> new EntityNotFoundException("Harvest batch not found with id: " + id));
    }

    public void delete(Long id) {
        HarvestBatch batch = harvestBatchRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Harvest batch not found with id: " + id));
        batch.setArchived(1);
        harvestBatchRepository.save(batch);
    }
}
