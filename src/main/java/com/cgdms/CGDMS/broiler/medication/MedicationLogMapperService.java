package com.cgdms.CGDMS.broiler.medication;

import org.springframework.stereotype.Service;

@Service
public class MedicationLogMapperService {

    public MedicationLog toEntity(MedicationLogRequest request) {
        if (request == null) return null;

        return MedicationLog.builder()
                .date(request.getDate())
                .drug(request.getDrug())
                .dose(request.getDose())
                .route(request.getRoute())
                .withdrawalDays(request.getWithdrawalDays())
                .build();
        // flockId resolved in Service
    }

    public MedicationLogResponse toResponse(MedicationLog m) {
        if (m == null) return null;

        return MedicationLogResponse.builder()
                .id(m.getId())
                .date(m.getDate())
                .flockId(m.getFlock() != null ? m.getFlock().getId() : null)
                .drug(m.getDrug())
                .dose(m.getDose())
                .route(m.getRoute())
                .withdrawalDays(m.getWithdrawalDays())
                .build();
    }
}
