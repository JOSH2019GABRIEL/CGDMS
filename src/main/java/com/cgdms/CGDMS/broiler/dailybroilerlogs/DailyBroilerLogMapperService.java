package com.cgdms.CGDMS.broiler.dailybroilerlogs;

import org.springframework.stereotype.Service;

@Service
public class DailyBroilerLogMapperService {

    public DailyBroilerLog toEntity(DailyBroilerLogRequest request) {
        if (request == null) return null;

        return DailyBroilerLog.builder()
                .date(request.getDate())
                .feedType(request.getFeedType())
                .feedQtyKg(request.getFeedQtyKg())
                .waterCheck(request.getWaterCheck())
                .temp(request.getTemp())
                .mortalityCount(request.getMortalityCount())
                .notes(request.getNotes())
                .build();
        // flockId & staffId should be resolved in Service
    }

    public DailyBroilerLogResponse toResponse(DailyBroilerLog log) {
        if (log == null) return null;

        return DailyBroilerLogResponse.builder()
                .id(log.getId())
                .date(log.getDate())
                .flockId(log.getFlock() != null ? log.getFlock().getId() : null)
                .feedType(log.getFeedType())
                .feedQtyKg(log.getFeedQtyKg())
                .waterCheck(log.getWaterCheck())
                .temp(log.getTemp())
                .mortalityCount(log.getMortalityCount())
                .notes(log.getNotes())
//                .staffId(log.getStaff() != null ? log.getStaff().getId() : null)
                .build();
    }
}
