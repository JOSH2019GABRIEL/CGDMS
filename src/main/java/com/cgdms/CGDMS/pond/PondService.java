package com.cgdms.CGDMS.pond;

import com.cgdms.CGDMS.common.PageResponse;
import com.cgdms.CGDMS.user.User;
import com.cgdms.CGDMS.user.UserResponse;
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

    public PondRequest savePond(PondRequest pondRequest) {
        Pond pond;

        if (pondRequest.getId() != null) {
            // Updating an existing pond
            pond = pondRepository.findById(pondRequest.getId())
                    .orElseThrow(() -> new EntityNotFoundException("Pond not found with id: " + pondRequest.getId()));

            // update only relevant fields
            pond.setName(pondRequest.getName());
            pond.setCapacity(pondRequest.getCapacity());
            pond.setLocation(pondRequest.getLocation());
            pond.setStatus(pondRequest.getStatus());

        } else {
            // Creating new pond
            pond = pondMapperService.toPond(pondRequest);
        }

        pondRepository.save(pond);
        return pondRequest;
    }


    public PageResponse<PondResponse> findAllPond(int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdDate").descending());

        Page<Pond> ponds = pondRepository.findAllNotArchived(pageable); // or findAllUsers if you need custom filtering

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
}
