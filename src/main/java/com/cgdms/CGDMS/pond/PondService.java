package com.cgdms.CGDMS.pond;

import com.cgdms.CGDMS.common.AuthUtils;
import com.cgdms.CGDMS.common.PageResponse;
import com.cgdms.CGDMS.user.User;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PondService {

    @Autowired
    private PondMapperService pondMapperService;
    @Autowired
    private PondRepository pondRepository;
    @Autowired
    private AuthUtils authUtils;

    public PondRequest savePond(PondRequest pondRequest) {
        Pond pond;

        if (pondRequest.getId() != null) {
            pond = pondRepository.findById(pondRequest.getId())
                    .orElseThrow(() -> new EntityNotFoundException("Pond not found with id: " + pondRequest.getId()));
            pond.setName(pondRequest.getName());
            pond.setCapacity(pondRequest.getCapacity());
            pond.setLocation(pondRequest.getLocation());
            pond.setStatus(pondRequest.getStatus());
//            pond.setFarm();

        } else {
            pond = pondMapperService.toPond(pondRequest);
        }

        pondRepository.save(pond);
        return pondRequest;
    }


    public PageResponse<PondResponse> findAllPond(int page, int size) {

        User loggedInUser = authUtils.getCurrentUser();
        boolean isAdmin = authUtils.isAdmin();
        Long farmId = authUtils.getCurrentUserFarmId();

        Pageable pageable = PageRequest.of(page, size, Sort.by("createdDate").descending());

        Page<Pond> ponds =  isAdmin
                ? pondRepository.findAllNotArchived(pageable, farmId)
                : pondRepository.findAllNotArchivedForUsers(pageable, loggedInUser.getId(), farmId);


        List<PondResponse> pondResponses = ponds.stream()
                .map(pondMapperService::toPondResponse)
                .toList();

        return new PageResponse<>(
                pondResponses,
                ponds.getNumber(),
                ponds.getSize(),
                ponds.getTotalElements(),
                ponds.getTotalPages(),
                ponds.isFirst(),
                ponds.isLast()
        );
    }

    public PondResponse findById(Long pondId) {
        return pondRepository.findById(pondId)
                .map(pondMapperService::toPondResponse)
                .orElseThrow(()-> new EntityNotFoundException("Pond ID couldnt be found: " +pondId));
    }

    public void deletePond (Long pondId) {
        Pond pond = pondRepository.findById(pondId).orElseThrow(()-> new RuntimeException("Pond not found"));
        pond.setArchived(1);
        pondRepository.save(pond);

    }

    public Integer totalNumberOfPonds() {
        Long farmId = authUtils.getCurrentUserFarmId();
        return pondRepository.findAllCount(farmId);
    }

    public Integer totalNumberOfAvailableFingerlings() {
        Long farmId = authUtils.getCurrentUserFarmId();
        return pondRepository.getAvailableFingerlingsInPonds(farmId);
    }
}
