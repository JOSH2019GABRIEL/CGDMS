package com.cgdms.CGDMS.broiler.harvest;

import com.cgdms.CGDMS.broiler.flock.Flock;
import com.cgdms.CGDMS.broiler.flock.FlockRepository;
import com.cgdms.CGDMS.common.PageResponse;
import com.cgdms.CGDMS.user.User;
import com.cgdms.CGDMS.user.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class HarvestEventService {

    @Autowired
    private HarvestEventMapperService mapper;

    @Autowired
    private HarvestEventRepository harvestEventRepository;

    @Autowired
    private FlockRepository flockRepository;

    @Autowired
    private UserRepository userRepository;

    public HarvestEventRequest saveHarvest(HarvestEventRequest request) {
        HarvestEvent harvest;

        if (request.getId() != null) {
            // update existing harvest
            harvest = harvestEventRepository.findById(request.getId())
                    .orElseThrow(() -> new EntityNotFoundException("HarvestEvent not found with id: " + request.getId()));

            //TODO add userId
            harvest.setDate(request.getDate());
            harvest.setTotalHarvested(request.getTotalHarvested());
            harvest.setAverageLiveWeight(request.getAverageLiveWeight());
            harvest.setCullCount(request.getCullCount());
            harvest.setArchived(0);

            if (request.getFlockId() != null) {
                Flock flock = flockRepository.findById(request.getFlockId())
                        .orElseThrow(() -> new EntityNotFoundException("Flock not found with id: " + request.getFlockId()));
                harvest.setFlock(flock);
            }

//            if (request.getOperatorId() != null) {
//                User staff = userRepository.findById(request.getOperatorId())
//                        .orElseThrow(() -> new EntityNotFoundException("Staff not found with id: " + request.getOperatorId()));
//                harvest.setOperatorId(staff);
//            }

        } else {
            // create new harvest
            harvest = mapper.toEntity(request);

            if (request.getFlockId() != null) {
                Flock flock = flockRepository.findById(request.getFlockId())
                        .orElseThrow(() -> new EntityNotFoundException("Flock not found with id: " + request.getFlockId()));
                harvest.setFlock(flock);
            }
            harvest.setArchived(0);


//            if (request.getOperatorId() != null) {
//                User staff = userRepository.findById(request.getOperatorId())
//                        .orElseThrow(() -> new EntityNotFoundException("Staff not found with id: " + request.getOperatorId()));
//                harvest.setOperatorId(staff);
//            }
        }

        harvestEventRepository.save(harvest);
        return request;
    }

    public PageResponse<HarvestEventResponse> findAllHarvests(int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdDate").descending());

        Page<HarvestEvent> harvests = harvestEventRepository.findAllNotArchived(pageable);

        List<HarvestEventResponse> responses = harvests.stream()
                .map(mapper::toResponse)
                .toList();

        return new PageResponse<>(
                responses,
                harvests.getNumber(),
                harvests.getSize(),
                harvests.getTotalElements(),
                harvests.getTotalPages(),
                harvests.isFirst(),
                harvests.isLast()
        );
    }

    public HarvestEventResponse findById(Long harvestId) {
        return harvestEventRepository.findById(harvestId)
                .map(mapper::toResponse)
                .orElseThrow(() -> new EntityNotFoundException("HarvestEvent not found with id: " + harvestId));
    }

    public void deleteHarvest(Long harvestId) {
        HarvestEvent harvest = harvestEventRepository.findById(harvestId)
                .orElseThrow(() -> new EntityNotFoundException("HarvestEvent not found with id: " + harvestId));

        harvest.setArchived(1);
        harvestEventRepository.save(harvest);
    }
}
