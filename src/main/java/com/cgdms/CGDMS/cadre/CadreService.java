package com.cgdms.CGDMS.cadre;

import com.cgdms.CGDMS.common.AuthUtils;
import com.cgdms.CGDMS.common.PageResponse;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;



@Service
@RequiredArgsConstructor
public class CadreService {

    private final CadreRepository cadreRepository;
    private final CadreMapperService mapper;
    private final CadreMapperService cadreMapperService;
    private final AuthUtils authUtils;

    public CadreRequest createCadre(CadreRequest request) {
        Cadre cadre;

        if (request.getId() != null) {
            cadre = cadreRepository.findById(request.getId())
                    .orElseThrow(() -> new EntityNotFoundException("Pond not found with id: " + request.getId()));
            cadre.setCadreName(request.getCadreName());
            cadre.setRate(request.getRate());
            cadre.setDescription(request.getDescription());
            cadre.setPaymentType(request.getPaymentType());
//            cadre.setFarm();
//            pond.setFarm();

        } else {
            cadre = cadreMapperService.toEntity(request);
        }

        cadreRepository.save(cadre);
        return request;
    }

    public PageResponse<CadreResponse> getAllCadres(int page, int size) {
        boolean isAdmin = authUtils.isAdmin();
        Long farmId = authUtils.getCurrentUserFarmId();

        Pageable pageable = PageRequest.of(page, size, Sort.by("createdDate").descending());
        Page<Cadre> cadres = isAdmin ? cadreRepository.findAllNotArchived(pageable, farmId) : null;

        var responses = cadres.getContent().stream()
                .map(mapper::toResponse)
                .toList();

        return new PageResponse<>(
                responses,
                cadres.getNumber(),
                cadres.getSize(),
                cadres.getTotalElements(),
                cadres.getTotalPages(),
                cadres.isFirst(),
                cadres.isLast()
        );
    }

    public CadreResponse getById(Long id) {
        Cadre cadre = cadreRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Farm not found with id " + id));
        return mapper.toResponse(cadre);
    }

    public double calculatePay(Long cadreId, int hoursWorked, int daysWorked) {
        Cadre cadre = cadreRepository.findById(cadreId)
                .orElseThrow(() -> new RuntimeException("Cadre not found"));

        return switch (cadre.getPaymentType()) {
            case HOURLY -> cadre.getRate() * hoursWorked;
            case DAILY -> cadre.getRate() * daysWorked;
            case MONTHLY -> cadre.getRate(); // fixed salary
        };
    }


    public void deleteCadre (Long cadreId) {
        Cadre cadre = cadreRepository.findById(cadreId).orElseThrow(()-> new RuntimeException("Cadre not found"));
        cadre.setArchived(1);
        cadreRepository.save(cadre);

    }
}