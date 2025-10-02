package com.cgdms.CGDMS.broiler.vaccination;

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
public class VaccinationLogService {

    @Autowired
    private VaccinationLogMapperService mapper;

    @Autowired
    private VaccinationLogRepository vaccinationLogRepository;

    @Autowired
    private FlockRepository flockRepository;

    @Autowired
    private UserRepository userRepository;

    public VaccinationLogRequest saveVaccinationLog(VaccinationLogRequest request) {
        VaccinationLog log;

        if (request.getId() != null) {
            // update existing vaccination log
            log = vaccinationLogRepository.findById(request.getId())
                    .orElseThrow(() -> new EntityNotFoundException("VaccinationLog not found with id: " + request.getId()));

            log.setDate(request.getDate());
            log.setVaccineName(request.getVaccineName());
            log.setDose(request.getDose());
            log.setRoute(request.getRoute());

            if (request.getFlockId() != null) {
                Flock flock = flockRepository.findById(request.getFlockId())
                        .orElseThrow(() -> new EntityNotFoundException("Flock not found with id: " + request.getFlockId()));
                log.setFlock(flock);
            }

            if (request.getOperatorId() != null) {
                User operator = userRepository.findById(request.getOperatorId())
                        .orElseThrow(() -> new EntityNotFoundException("Operator not found with id: " + request.getOperatorId()));
                log.setOperator(operator);
            }

        } else {
            // create new vaccination log
            log = mapper.toEntity(request);

            if (request.getFlockId() != null) {
                Flock flock = flockRepository.findById(request.getFlockId())
                        .orElseThrow(() -> new EntityNotFoundException("Flock not found with id: " + request.getFlockId()));
                log.setFlock(flock);
            }

            if (request.getOperatorId() != null) {
                User operator = userRepository.findById(request.getOperatorId())
                        .orElseThrow(() -> new EntityNotFoundException("Operator not found with id: " + request.getOperatorId()));
                log.setOperator(operator);
            }
        }

        vaccinationLogRepository.save(log);
        return request;
    }

    public PageResponse<VaccinationLogResponse> findAllVaccinationLogs(int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdDate").descending());

        Page<VaccinationLog> logs = vaccinationLogRepository.findAllNotArchived(pageable);

        List<VaccinationLogResponse> responses = logs.stream()
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

    public VaccinationLogResponse findById(Long vaccinationLogId) {
        return vaccinationLogRepository.findById(vaccinationLogId)
                .map(mapper::toResponse)
                .orElseThrow(() -> new EntityNotFoundException("VaccinationLog not found with id: " + vaccinationLogId));
    }

    public void deleteVaccinationLog(Long vaccinationLogId) {
        VaccinationLog log = vaccinationLogRepository.findById(vaccinationLogId)
                .orElseThrow(() -> new EntityNotFoundException("VaccinationLog not found with id: " + vaccinationLogId));

        log.setArchived(1);
        vaccinationLogRepository.save(log);
    }
}
