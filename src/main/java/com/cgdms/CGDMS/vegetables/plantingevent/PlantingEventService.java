package com.cgdms.CGDMS.vegetables.plantingevent;


import com.cgdms.CGDMS.common.PageResponse;
import com.cgdms.CGDMS.vegetables.crop.CropVariety;
import com.cgdms.CGDMS.vegetables.crop.CropVarietyRepository;
import com.cgdms.CGDMS.vegetables.plots.Plot;
import com.cgdms.CGDMS.vegetables.plots.PlotRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class PlantingEventService {

    @Autowired
    private PlantingEventRepository plantingEventRepository;

    @Autowired
    private CropVarietyRepository cropVarietyRepository;

    @Autowired
    private PlotRepository plotRepository;

    @Autowired
    private PlantingEventMapper mapper;

    public PlantingEventRequest saveEvent(PlantingEventRequest request) {
        PlantingEvent event;
        Plot plot = null;
        CropVariety cropVariety = null;

        if (request.getId() != null) {
            event = plantingEventRepository.findById(request.getId())
                    .orElseThrow(() -> new EntityNotFoundException("Planting event not found with id: " + request.getId()));

            if (request.getPlotId() != null){
                plot = plotRepository.findById(request.getPlotId())
                        .orElseThrow(()-> new EntityNotFoundException("Harvest batch not found with id: " + request.getPlotId()));
            }

            if (request.getCropId() != null){
                cropVariety = cropVarietyRepository.findById(request.getCropId())
                        .orElseThrow(()-> new EntityNotFoundException("Harvest batch not found with id: " + request.getCropId()));
            }
            event.setDate(request.getDate());
            event.setPlot(plot);
            event.setCrop(cropVariety);
            event.setSeedBatch(request.getSeedBatch());
            event.setSeedCount(request.getSeedCount());
            event.setExpectedHarvestDate(request.getExpectedHarvestDate());

        } else {
            event = mapper.toEntity(request, plot, cropVariety);
        }

        event.setArchived(0);
        plantingEventRepository.save(event);
        return request;
    }

    public PageResponse<PlantingEventResponse> findAll(int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("date").descending());
        Page<PlantingEvent> list = plantingEventRepository.findAllNotArchived(pageable);
        List<PlantingEventResponse> responses = list.stream().map(mapper::toResponse).toList();
        return new PageResponse<>(responses, list.getNumber(), list.getSize(), list.getTotalElements(),
                list.getTotalPages(), list.isFirst(), list.isLast());
    }

    public PlantingEventResponse findById(Long id) {
        return plantingEventRepository.findById(id)
                .map(mapper::toResponse)
                .orElseThrow(() -> new EntityNotFoundException("Planting event not found with id: " + id));
    }

    public void delete(Long id) {
        PlantingEvent entity = plantingEventRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Planting event not found with id: " + id));
        entity.setArchived(1);
        plantingEventRepository.save(entity);
    }
}

