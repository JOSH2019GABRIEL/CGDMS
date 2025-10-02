package com.cgdms.CGDMS.broiler.medication;

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
public class MedicationLogService {

    @Autowired
    private MedicationLogMapperService mapper;

    @Autowired
    private MedicationLogRepository medicationLogRepository;

    @Autowired
    private FlockRepository flockRepository;

    @Autowired
    private UserRepository userRepository;

    public MedicationLogRequest saveMedication(MedicationLogRequest request) {
        MedicationLog medication;

        if (request.getId() != null) {
            // update existing medication log
            medication = medicationLogRepository.findById(request.getId())
                    .orElseThrow(() -> new EntityNotFoundException("MedicationLog not found with id: " + request.getId()));

            medication.setDate(request.getDate());
            medication.setDrug(request.getDrug());
            medication.setDose(request.getDose());
            medication.setRoute(request.getRoute());
            medication.setWithdrawalDays(request.getWithdrawalDays());

            if (request.getFlockId() != null) {
                Flock flock = flockRepository.findById(request.getFlockId())
                        .orElseThrow(() -> new EntityNotFoundException("Flock not found with id: " + request.getFlockId()));
                medication.setFlock(flock);
            }

//            if (request.getOperatorId() != null) {
//                User operator = userRepository.findById(request.getOperatorId())
//                        .orElseThrow(() -> new EntityNotFoundException("Operator not found with id: " + request.getOperatorId()));
//                medication.setOperator(operator);
//            }

        } else {
            // create new medication log
            medication = mapper.toEntity(request);

            if (request.getFlockId() != null) {
                Flock flock = flockRepository.findById(request.getFlockId())
                        .orElseThrow(() -> new EntityNotFoundException("Flock not found with id: " + request.getFlockId()));
                medication.setFlock(flock);
            }

//            if (request.getOperatorId() != null) {
//                User operator = userRepository.findById(request.getOperatorId())
//                        .orElseThrow(() -> new EntityNotFoundException("Operator not found with id: " + request.getOperatorId()));
//                medication.setOperator(operator);
//            }
        }

        medicationLogRepository.save(medication);
        return request;
    }

    public PageResponse<MedicationLogResponse> findAllMedications(int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdDate").descending());

        Page<MedicationLog> medications = medicationLogRepository.findAllNotArchived(pageable);

        List<MedicationLogResponse> responses = medications.stream()
                .map(mapper::toResponse)
                .toList();

        return new PageResponse<>(
                responses,
                medications.getNumber(),
                medications.getSize(),
                medications.getTotalElements(),
                medications.getTotalPages(),
                medications.isFirst(),
                medications.isLast()
        );
    }

    public MedicationLogResponse findById(Long medicationId) {
        return medicationLogRepository.findById(medicationId)
                .map(mapper::toResponse)
                .orElseThrow(() -> new EntityNotFoundException("MedicationLog not found with id: " + medicationId));
    }

    public void deleteMedication(Long medicationId) {
        MedicationLog medication = medicationLogRepository.findById(medicationId)
                .orElseThrow(() -> new EntityNotFoundException("MedicationLog not found with id: " + medicationId));

        medication.setArchived(1);
        medicationLogRepository.save(medication);
    }
}
