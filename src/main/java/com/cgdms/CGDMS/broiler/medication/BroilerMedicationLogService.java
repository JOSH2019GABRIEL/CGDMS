package com.cgdms.CGDMS.broiler.medication;

import com.cgdms.CGDMS.broiler.flock.Flock;
import com.cgdms.CGDMS.broiler.flock.FlockRepository;
import com.cgdms.CGDMS.common.PageResponse;
import com.cgdms.CGDMS.user.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class BroilerMedicationLogService {

    @Autowired
    private BroilerMedicationLogMapperService mapper;

    @Autowired
    private BroilerMedicationLogRepository broilerMedicationLogRepository;

    @Autowired
    private FlockRepository flockRepository;

    @Autowired
    private UserRepository userRepository;

    public BroilerMedicationLogRequest saveMedication(BroilerMedicationLogRequest request) {
        BroilerMedicationLog medication;

        if (request.getId() != null) {
            // update existing medication log
            medication = broilerMedicationLogRepository.findById(request.getId())
                    .orElseThrow(() -> new EntityNotFoundException("MedicationLog not found with id: " + request.getId()));

            medication.setDate(request.getDate());
            medication.setDrug(request.getDrug());
            medication.setDose(request.getDose());
            medication.setRoute(request.getRoute());
            medication.setWithdrawalDays(request.getWithdrawalDays());
            medication.setArchived(0);

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
            medication.setArchived(0);

//            if (request.getOperatorId() != null) {
//                User operator = userRepository.findById(request.getOperatorId())
//                        .orElseThrow(() -> new EntityNotFoundException("Operator not found with id: " + request.getOperatorId()));
//                medication.setOperator(operator);
//            }
        }

        broilerMedicationLogRepository.save(medication);
        return request;
    }

    public PageResponse<BroilerMedicationLogResponse> findAllMedications(int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdDate").descending());

        Page<BroilerMedicationLog> medications = broilerMedicationLogRepository.findAllNotArchived(pageable);

        List<BroilerMedicationLogResponse> responses = medications.stream()
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

    public BroilerMedicationLogResponse findById(Long medicationId) {
        return broilerMedicationLogRepository.findById(medicationId)
                .map(mapper::toResponse)
                .orElseThrow(() -> new EntityNotFoundException("MedicationLog not found with id: " + medicationId));
    }

    public void deleteMedication(Long medicationId) {
        BroilerMedicationLog medication = broilerMedicationLogRepository.findById(medicationId)
                .orElseThrow(() -> new EntityNotFoundException("MedicationLog not found with id: " + medicationId));

        medication.setArchived(1);
        broilerMedicationLogRepository.save(medication);
    }
}
