package com.cgdms.CGDMS.fishmanagement.service;

import com.cgdms.CGDMS.common.AuthUtils;
import com.cgdms.CGDMS.common.PageResponse;
import com.cgdms.CGDMS.fishmanagement.entity.LiveSalesDetails;
import com.cgdms.CGDMS.fishmanagement.entity.NominalLoss;
import com.cgdms.CGDMS.fishmanagement.entity.request.NominalLossRequest;
import com.cgdms.CGDMS.fishmanagement.entity.response.LiveSalesResponse;
import com.cgdms.CGDMS.fishmanagement.entity.response.NominalLossResponse;
import com.cgdms.CGDMS.fishmanagement.repository.NominalLossRepository;
import com.cgdms.CGDMS.fishmanagement.service.mapper.NominalLossMapperService;
import com.cgdms.CGDMS.user.User;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class NominalLossService {

    private final AuthUtils authUtils;
    private final NominalLossRepository nominalLossRepository;
    private final NominalLossMapperService mapper;

    public NominalLossRequest saveNominalLoss(NominalLossRequest request) {
        NominalLoss nominalLoss;

        if (request.getId() != null) {
            nominalLoss = nominalLossRepository.findById(request.getId())
                            .orElseThrow(() -> new EntityNotFoundException("Nominal Loss not found: " +request.getId()));
        nominalLoss.setRate(request.getRate());
        nominalLoss.setValue(request.getValue());
        nominalLoss.setDescription(request.getDescription());
        nominalLoss.setCategory(request.getCategory());

        } else {
            nominalLoss = mapper.toEntity(request);
        }
        nominalLossRepository.save(nominalLoss);
        return request;
    }


    public PageResponse<NominalLossResponse> findAllNominalLoss(int page, int size) {
        User loggedInUser = authUtils.getCurrentUser();
        boolean isAdmin = authUtils.isAdmin();
        Long farmId = authUtils.getCurrentUserFarmId();

        Pageable pageable = PageRequest.of(page, size, Sort.by("createdDate").descending());

        Page<NominalLoss> nominalLosses = isAdmin ? nominalLossRepository.findAllNotArchived(pageable, farmId) : nominalLossRepository.findAllNotArchivedForUsers(pageable, farmId, loggedInUser.getId());

        List<NominalLossResponse> responses = nominalLosses.stream()
                .map(mapper::toResponse)
                .toList();

        return new PageResponse<>(
                responses,
                nominalLosses.getNumber(),
                nominalLosses.getSize(),
                nominalLosses.getTotalElements(),
                nominalLosses.getTotalPages(),
                nominalLosses.isFirst(),
                nominalLosses.isLast()
        );
    }

    public NominalLossResponse getNominalLoss(Long id) {
        return nominalLossRepository.findById(id)
                .map(mapper::toResponse)
                .orElseThrow(() -> new EntityNotFoundException("Nominal Loss not found: " +id));
    }

    public void deleteNominalLoss(Long id) {
        NominalLoss nominalLoss = nominalLossRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Nominal Loss not found: " +id));
        nominalLoss.setArchived(1);
        nominalLossRepository.save(nominalLoss);
    }


}
