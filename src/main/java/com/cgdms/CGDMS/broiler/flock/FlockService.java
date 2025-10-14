package com.cgdms.CGDMS.broiler.flock;

import com.cgdms.CGDMS.common.AuthUtils;
import com.cgdms.CGDMS.common.PageResponse;
import com.cgdms.CGDMS.farm.Farm;
import com.cgdms.CGDMS.farm.FarmRepository;
import com.cgdms.CGDMS.user.User;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class FlockService {

    @Autowired
    private FlockMapperService mapper;

    @Autowired
    private FlockRepository flockRepository;

    @Autowired
    private FarmRepository farmRepository;
    @Autowired
    private AuthUtils authUtils;


    public FlockRequest saveFlock(FlockRequest flockRequest) {
        Flock flock;

        if (flockRequest.getId() != null) {
            // update existing
            flock = flockRepository.findById(flockRequest.getId())
                    .orElseThrow(() -> new EntityNotFoundException("Flock not found with id: " + flockRequest.getId()));

            flock.setSource(flockRequest.getSource());
            flock.setHatchDate(flockRequest.getHatchDate());
            flock.setStockingCount(flockRequest.getStockingCount());
            flock.setSexRatio(flockRequest.getSexRatio());
            flock.setExpectedCycleDays(flockRequest.getExpectedCycleDays());
            flock.setTargetWeight(flockRequest.getTargetWeight());
            flock.setVaccineProfile(flockRequest.getVaccineProfile());
            flock.setArchived(0);


        } else {
            // create new
            flock = mapper.toEntity(flockRequest);

        }

        flock.setArchived(0);
        flockRepository.save(flock);
        return flockRequest;
    }


    @Transactional(readOnly = true)
    public PageResponse<FlockResponse> findAllFlocks(int page, int size) {
        User loggedInUser = authUtils.getCurrentUser();
        boolean isAdmin = authUtils.isAdmin();
        Long farmId = authUtils.getCurrentUserFarmId();

        Pageable pageable = PageRequest.of(page, size, Sort.by("createdDate").descending());
        Page<Flock> flocks = isAdmin
                ? flockRepository.findAllNotArchived(pageable, farmId)
                : flockRepository.findAllNotArchivedForUsers(pageable, loggedInUser.getId(), farmId);;

        List<FlockResponse> responses = flocks.stream()
                .map(mapper::toResponse)
                .toList();

        return new PageResponse<>(
                responses,
                flocks.getNumber(),
                flocks.getNumberOfElements(),
                flocks.getTotalElements(),
                flocks.getTotalPages(),
                flocks.isFirst(),
                flocks.isLast()


        );
    }

    public FlockResponse findById(Long flockId) {
        return flockRepository.findById(flockId)
                .map(mapper::toResponse)
                .orElseThrow(() -> new EntityNotFoundException("Flock not found with id: " + flockId));
    }


    public void deleteFlock(Long flockId) {
        Flock flock = flockRepository.findById(flockId)
                .orElseThrow(() -> new EntityNotFoundException("Flock not found with id: " + flockId));

        flock.setArchived(1);
        flockRepository.save(flock);
    }
}
