package com.cgdms.CGDMS.vegetables.croplog;


import com.cgdms.CGDMS.common.AuthUtils;
import com.cgdms.CGDMS.common.PageResponse;
import com.cgdms.CGDMS.user.User;
import com.cgdms.CGDMS.vegetables.plots.Plot;
import com.cgdms.CGDMS.vegetables.plots.PlotRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class CropLogService {

    @Autowired
    private CropLogRepository cropLogRepository;

    @Autowired
    private PlotRepository plotRepository;

    @Autowired
    private CropLogMapper mapper;
    @Autowired
    private AuthUtils authUtils;


    public CropLogRequest saveCropLog(CropLogRequest request) {
        CropLog log;
        Plot plot = null;


        if (request.getId() != null) {
            log = cropLogRepository.findById(request.getId())
                    .orElseThrow(() -> new EntityNotFoundException("Crop log not found with id: " + request.getId()));

            if (request.getPlotId() != null){
                plot = plotRepository.findById(request.getPlotId())
                        .orElseThrow(()-> new EntityNotFoundException("Harvest batch not found with id: " + request.getPlotId()));
            }

            log.setDate(request.getDate());
            if (request.getPlotId() != null) {
                log.setPlot(plot);
            }
            log.setCropStage(request.getCropStage());
            log.setIrrigationL(request.getIrrigationL());
            log.setFertilizerG(request.getFertilizerG());
            log.setPesticideApplied(request.getPesticideApplied());
            log.setStaffId(request.getStaffId());

        } else {
            log = mapper.toEntity(request, plot);
        }

        log.setArchived(0);
        cropLogRepository.save(log);
        return request;
    }

    public PageResponse<CropLogResponse> findAll(int page, int size) {
        User loggedInUser = authUtils.getCurrentUser();
        boolean isAdmin = authUtils.isAdmin();
        Long farmId = authUtils.getCurrentUserFarmId();


        Pageable pageable = PageRequest.of(page, size, Sort.by("date").descending());
        Page<CropLog> logs = isAdmin ? cropLogRepository.findAllNotArchived(pageable, farmId) : cropLogRepository.findAllNotArchivedForUsers(pageable, farmId, loggedInUser.getId());
        List<CropLogResponse> responses = logs.stream().map(mapper::toResponse).toList();
        return new PageResponse<>(responses, logs.getNumber(), logs.getSize(),
                logs.getTotalElements(), logs.getTotalPages(), logs.isFirst(), logs.isLast());
    }

    public CropLogResponse findById(Long id) {
        return cropLogRepository.findById(id)
                .map(mapper::toResponse)
                .orElseThrow(() -> new EntityNotFoundException("Crop log not found with id: " + id));
    }

    public void delete(Long id) {
        CropLog log = cropLogRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Crop log not found with id: " + id));
        log.setArchived(1);
        cropLogRepository.save(log);
    }
}
