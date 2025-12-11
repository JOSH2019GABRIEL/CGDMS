package com.cgdms.CGDMS.fishmanagement.service.mapper;

import com.cgdms.CGDMS.fishmanagement.entity.NominalLoss;
import com.cgdms.CGDMS.fishmanagement.entity.request.NominalLossRequest;
import com.cgdms.CGDMS.fishmanagement.entity.response.NominalLossResponse;
import com.cgdms.CGDMS.fishmanagement.repository.NominalLossRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class NominalLossMapperService {

    private final NominalLossRepository nominalLossRepository;

    public NominalLoss toEntity (NominalLossRequest request) {

        return NominalLoss.builder()
                .value(request.getValue())
                .rate(request.getRate())
                .description(request.getDescription())
                .category(request.getCategory())
                .archived(0)
                .build();
    }

    public NominalLossResponse toResponse(NominalLoss response) {

        return NominalLossResponse.builder()
                .value(response.getValue())
                .rate(response.getRate().name())
                .description(response.getDescription())
                .id(response.getId())
                .category(response.getCategory())
                .build();
    }

}
