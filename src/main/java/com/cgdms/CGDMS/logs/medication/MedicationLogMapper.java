package com.cgdms.CGDMS.logs.medication;

import com.cgdms.CGDMS.batch.BatchRepository;
import com.cgdms.CGDMS.pond.PondRepository;
import com.cgdms.CGDMS.user.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class MedicationLogMapper {

    private final PondRepository pondRepository;
    private final BatchRepository batchRepository;
    private final UserRepository staffRepository;

    public MedicationLog toEntity(MedicationLogRequest req) {
        MedicationLog m = MedicationLog.builder()
                .treatmentDate(req.getTreatmentDate())
                .diagnosis(req.getDiagnosis())
                .medication(req.getMedication())
                .dosage(req.getDosage())
                .dosageUnit(req.getDosageUnit())
                .quantityUsed(req.getQuantityUsed())
                .method(req.getMethod())
                .notes(req.getNotes())
                .withdrawalDays(req.getWithdrawalDays())
                .build();

        // required pond
        var pond = pondRepository.findById(req.getPondId())
                .orElseThrow(() -> new IllegalArgumentException("Pond not found with id: " + req.getPondId()));
        m.setPond(pond);

        // optional batch
        if (req.getBatchId() != null) {
            var batch = batchRepository.findById(req.getBatchId())
                    .orElseThrow(() -> new IllegalArgumentException("Batch not found with id: " + req.getBatchId()));
            m.setBatch(batch);
        }

        // optional staff
        if (req.getAdministeredById() != null) {
            var staff = staffRepository.findById(req.getAdministeredById())
                    .orElseThrow(() -> new IllegalArgumentException("Staff not found with id: " + req.getAdministeredById()));
            m.setAdministeredBy(staff);
        }

        return m;
    }

    public void applyUpdate(MedicationLog target, MedicationLogRequest req) {
        if (req.getTreatmentDate() != null) target.setTreatmentDate(req.getTreatmentDate());
        if (req.getDiagnosis() != null) target.setDiagnosis(req.getDiagnosis());
        if (req.getMedication() != null) target.setMedication(req.getMedication());
        if (req.getDosage() != null) target.setDosage(req.getDosage());
        if (req.getDosageUnit() != null) target.setDosageUnit(req.getDosageUnit());
        if (req.getQuantityUsed() != null) target.setQuantityUsed(req.getQuantityUsed());
        if (req.getMethod() != null) target.setMethod(req.getMethod());
        if (req.getNotes() != null) target.setNotes(req.getNotes());
        if (req.getWithdrawalDays() != null) target.setWithdrawalDays(req.getWithdrawalDays());

        if (req.getPondId() != null) {
            var pond = pondRepository.findById(req.getPondId())
                    .orElseThrow(() -> new IllegalArgumentException("Pond not found with id: " + req.getPondId()));
            target.setPond(pond);
        }
        if (req.getBatchId() != null) {
            var batch = batchRepository.findById(req.getBatchId())
                    .orElseThrow(() -> new IllegalArgumentException("Batch not found with id: " + req.getBatchId()));
            target.setBatch(batch);
        }
        if (req.getAdministeredById() != null) {
            var staff = staffRepository.findById(req.getAdministeredById())
                    .orElseThrow(() -> new IllegalArgumentException("Staff not found with id: " + req.getAdministeredById()));
            target.setAdministeredBy(staff);
        }
    }

    public MedicationLogResponse toResponse(MedicationLog e) {
        return MedicationLogResponse.builder()
                .id(e.getId())
                .treatmentDate(e.getTreatmentDate())
                .pondId(e.getPond() != null ? e.getPond().getId() : null)
                .pondName(e.getPond() != null ? e.getPond().getName() : null)
                .batchId(e.getBatch() != null ? e.getBatch().getId() : null)
                .diagnosis(e.getDiagnosis())
                .medication(e.getMedication())
                .dosage(e.getDosage())
                .dosageUnit(e.getDosageUnit())
                .quantityUsed(e.getQuantityUsed())
                .method(e.getMethod())
                .administeredById(e.getAdministeredBy() != null ? e.getAdministeredBy().getId() : null)
//                .administeredByName(e.getAdministeredBy() != null ? e.getAdministeredBy().getName() : null)
                .notes(e.getNotes())
                .withdrawalDays(e.getWithdrawalDays())
                .build();
    }
}
