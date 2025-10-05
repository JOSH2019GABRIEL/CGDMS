package com.cgdms.CGDMS.broiler.vaccination;

import org.springframework.stereotype.Service;

@Service
public class VaccinationLogMapperService {

    public VaccinationLog toEntity(VaccinationLogRequest request) {
        if (request == null) return null;

        return VaccinationLog.builder()
                .date(request.getDate())
                .vaccineName(request.getVaccineName())
                .dose(request.getDose())
                .route(request.getRoute())
                .build();
        // flockId & operatorId resolved in Service
    }

    public VaccinationLogResponse toResponse(VaccinationLog v) {
        if (v == null) return null;

        return VaccinationLogResponse.builder()
                .id(v.getId())
                .date(v.getDate())
                .flockId(v.getFlock() != null ? v.getFlock().getId() : null)
                .fullFlock((v.getFlock() != null ? v.getFlock().getId() : "") + "-" + (v.getFlock() != null ? v.getFlock().getSource() : ""))
                .vaccineName(v.getVaccineName())
                .dose(v.getDose())
                .route(v.getRoute())
//                .operatorId(v.getOperator() != null ? v.getOperator().getId() : null)
                .build();
    }
}
