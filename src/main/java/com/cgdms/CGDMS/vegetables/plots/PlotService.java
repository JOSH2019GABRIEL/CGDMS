package com.cgdms.CGDMS.vegetables.plots;


import com.cgdms.CGDMS.common.AuthUtils;
import com.cgdms.CGDMS.common.PageResponse;
import com.cgdms.CGDMS.user.User;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class PlotService {

    @Autowired
    private PlotRepository plotRepository;

    @Autowired
    private PlotMapper mapper;
    @Autowired
    private AuthUtils authUtils;

    public PlotRequest savePlot(PlotRequest request) {
        Plot plot;

        if (request.getId() != null) {
            plot = plotRepository.findById(request.getId())
                    .orElseThrow(() -> new EntityNotFoundException("Plot not found with id: " + request.getId()));

            plot.setType(request.getType());
            plot.setAreaM2(request.getAreaM2());
            plot.setSoilType(request.getSoilType());
            plot.setBedLayout(request.getBedLayout());
        } else {
            plot = mapper.toEntity(request);
        }

        plot.setArchived(0);
        plotRepository.save(plot);
        return request;
    }

    public PageResponse<PlotResponse> findAll(int page, int size) {
        User loggedInUser = authUtils.getCurrentUser();
        boolean isAdmin = authUtils.isAdmin();
        Long farmId = authUtils.getCurrentUserFarmId();


        Pageable pageable = PageRequest.of(page, size, Sort.by("createdDate").descending());
        Page<Plot> plots = isAdmin ? plotRepository.findAllNotArchived(pageable, farmId) : plotRepository.findAllNotArchivedForUsers(pageable, loggedInUser.getId(), farmId);
        List<PlotResponse> responses = plots.stream().map(mapper::toResponse).toList();
        return new PageResponse<>(responses, plots.getNumber(), plots.getSize(), plots.getTotalElements(),
                plots.getTotalPages(), plots.isFirst(), plots.isLast());
    }

    public PlotResponse findById(Long id) {
        return plotRepository.findById(id)
                .map(mapper::toResponse)
                .orElseThrow(() -> new EntityNotFoundException("Plot not found with id: " + id));
    }

    public void delete(Long id) {
        Plot plot = plotRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Plot not found with id: " + id));
        plot.setArchived(1);
        plotRepository.save(plot);
    }
    public Integer totalNumberOfPlots() {
        Long farmId = authUtils.getCurrentUserFarmId();
        return plotRepository.countAllPlots(farmId);
    }
}
