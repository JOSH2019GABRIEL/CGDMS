package com.cgdms.CGDMS.broiler.dailybroilerlogs;

import com.cgdms.CGDMS.broiler.flock.Flock;
import com.cgdms.CGDMS.broiler.flock.FlockRepository;
import com.cgdms.CGDMS.common.PageResponse;
import com.cgdms.CGDMS.user.User;
import com.cgdms.CGDMS.user.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class DailyBroilerLogService {

    @Autowired
    private DailyBroilerLogMapperService mapper;

    @Autowired
    private DailyBroilerLogRepository logRepository;

    @Autowired
    private FlockRepository flockRepository;

    @Autowired
    private UserRepository userRepository;

    public DailyBroilerLogRequest saveLog(DailyBroilerLogRequest request) {
        DailyBroilerLog log;

        if (request.getId() != null) {
            // update existing log
            log = logRepository.findById(request.getId())
                    .orElseThrow(() -> new EntityNotFoundException("DailyBroilerLog not found with id: " + request.getId()));

            log.setDate(request.getDate());
            log.setFeedType(request.getFeedType());
            log.setFeedQtyKg(request.getFeedQtyKg());
            log.setWaterCheck(request.getWaterCheck());
            log.setTemp(request.getTemp());
            log.setMortalityCount(request.getMortalityCount());
            log.setNotes(request.getNotes());

            if (request.getFlockId() != null) {
                Flock flock = flockRepository.findById(request.getFlockId())
                        .orElseThrow(() -> new EntityNotFoundException("Flock not found with id: " + request.getFlockId()));
                log.setFlock(flock);
            }

            if (request.getStaffId() != null) {
                User staff = userRepository.findById(request.getStaffId())
                        .orElseThrow(() -> new EntityNotFoundException("Staff not found with id: " + request.getStaffId()));
                log.setStaff(staff);
            }

        } else {
            // create new log
            log = mapper.toEntity(request);

            if (request.getFlockId() != null) {
                Flock flock = flockRepository.findById(request.getFlockId())
                        .orElseThrow(() -> new EntityNotFoundException("Flock not found with id: " + request.getFlockId()));
                log.setFlock(flock);
            }

            if (request.getStaffId() != null) {
                User staff = userRepository.findById(request.getStaffId())
                        .orElseThrow(() -> new EntityNotFoundException("Staff not found with id: " + request.getStaffId()));
                log.setStaff(staff);
            }
        }

        logRepository.save(log);
        return request;
    }

    public PageResponse<DailyBroilerLogResponse> findAllLogs(int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdDate").descending());

        Page<DailyBroilerLog> logs = logRepository.findAllNotArchived(pageable);

        List<DailyBroilerLogResponse> responses = logs.stream()
                .map(mapper::toResponse)
                .toList();

        return new PageResponse<>(
                responses,
                logs.getNumber(),
                logs.getSize(),
                logs.getTotalElements(),
                logs.getTotalPages(),
                logs.isFirst(),
                logs.isLast()
        );
    }

    public DailyBroilerLogResponse findById(Long logId) {
        return logRepository.findById(logId)
                .map(mapper::toResponse)
                .orElseThrow(() -> new EntityNotFoundException("DailyBroilerLog not found with id: " + logId));
    }

    public void deleteLog(Long logId) {
        DailyBroilerLog log = logRepository.findById(logId)
                .orElseThrow(() -> new EntityNotFoundException("DailyBroilerLog not found with id: " + logId));

        log.setArchived(1);
        logRepository.save(log);
    }
}
