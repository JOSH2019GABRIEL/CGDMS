package com.cgdms.CGDMS.vegetables.crop;


import com.cgdms.CGDMS.common.AuthUtils;
import com.cgdms.CGDMS.common.PageResponse;
import com.cgdms.CGDMS.user.User;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
@RequiredArgsConstructor
public class CropVarietyService {

    private final CropVarietyRepository cropVarietyRepository;
    private final AuthUtils authUtils;

    @Autowired
    private CropVarietyMapper mapper;


    public CropVarietyRequest saveCropVariety(CropVarietyRequest request) {
        CropVariety entity;

        if (request.getId() != null) {
            entity = cropVarietyRepository.findById(request.getId())
                    .orElseThrow(() -> new EntityNotFoundException("Crop Variety not found with id: " + request.getId()));

            entity.setCropName(request.getCropName());
            entity.setVariety(request.getVariety());
            entity.setSeedRateGPerM2(request.getSeedRateGPerM2());
            entity.setExpectedDaysToHarvest(request.getExpectedDaysToHarvest());
            entity.setGreenhouseDaysAdjustment(request.getGreenhouseDaysAdjustment());
            entity.setSpacing(request.getSpacing());

        } else {
            entity = mapper.toEntity(request);
        }

        entity.setArchived(0);
        cropVarietyRepository.save(entity);
        return request;
    }

    public PageResponse<CropVarietyResponse> findAll(int page, int size) {
        User loggedInUser = authUtils.getCurrentUser();
        boolean isAdmin = authUtils.isAdmin();
        Long farmId = authUtils.getCurrentUserFarmId();

        Pageable pageable = PageRequest.of(page, size, Sort.by("createdDate").descending());
        Page<CropVariety> list = isAdmin ? cropVarietyRepository.findAllNotArchived(pageable, farmId) : cropVarietyRepository.findAllNotArchivedForUsers(pageable, farmId, loggedInUser.getId());

        List<CropVarietyResponse> responses = list.stream().map(mapper::toResponse).toList();

        return new PageResponse<>(responses, list.getNumber(), list.getSize(),
                list.getTotalElements(), list.getTotalPages(), list.isFirst(), list.isLast());
    }

    public CropVarietyResponse findById(Long id) {
        return cropVarietyRepository.findById(id)
                .map(mapper::toResponse)
                .orElseThrow(() -> new EntityNotFoundException("Crop Variety not found with id: " + id));
    }

    public void delete(Long id) {
        CropVariety entity = cropVarietyRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Crop Variety not found with id: " + id));
        entity.setArchived(1);
        cropVarietyRepository.save(entity);
    }
}
