package com.cgdms.CGDMS.logs.medication;

import com.cgdms.CGDMS.common.AuthUtils;
import com.cgdms.CGDMS.common.PageResponse;
import com.cgdms.CGDMS.user.User;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class MedicationLogService {

    private final MedicationLogRepository repo;
    private final MedicationLogMapper mapper;
    private final AuthUtils authUtils;

    @Transactional
    public MedicationLogResponse create(MedicationLogRequest req) {
        MedicationLog entity = mapper.toEntity(req);
        MedicationLog saved = repo.save(entity);
        return mapper.toResponse(saved);
    }

    @Transactional
    public MedicationLogResponse update(Long id, MedicationLogRequest req) {
        MedicationLog existing = repo.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Medication log not found with id: " + id));
        mapper.applyUpdate(existing, req);
        MedicationLog saved = repo.save(existing);
        return mapper.toResponse(saved);
    }

    @Transactional
    public void delete(Long id) {
        if (!repo.existsById(id)) {
            throw new EntityNotFoundException("Medication log not found with id: " + id);
        }
        repo.deleteById(id);
    }

    @Transactional //(readOnly = true)
    public MedicationLogResponse findById(Long id) {
        var e = repo.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Medication log not found with id: " + id));
        return mapper.toResponse(e);
    }

    @Transactional //(readOnly = true)
    public PageResponse<MedicationLogResponse> listAll(int page, int size) {
        User loggedInUser = authUtils.getCurrentUser();
        boolean isAdmin = authUtils.isAdmin();
        Long farmId = authUtils.getCurrentUserFarmId();


        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "treatmentDate", "createdDate"));
        Page<MedicationLog> p = isAdmin ? repo.findAllNotArchived(pageable, farmId) : repo.findAllNotArchivedForUsers(pageable, loggedInUser.getId(), farmId);
        List<MedicationLogResponse> content = p.stream().map(mapper::toResponse).toList();
        return new PageResponse<>(content, p.getNumber(), p.getSize(), p.getTotalElements(), p.getTotalPages(), p.isFirst(), p.isLast());
    }

    @Transactional //(readOnly = true)
    public PageResponse<MedicationLogResponse> listByPond(Long pondId, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "treatmentDate"));
        Page<MedicationLog> p = repo.findByPond_Id(pondId, pageable);
        List<MedicationLogResponse> content = p.stream().map(mapper::toResponse).toList();
        return new PageResponse<>(content, p.getNumber(), p.getSize(), p.getTotalElements(), p.getTotalPages(), p.isFirst(), p.isLast());
    }

    @Transactional //(readOnly = true)
    public PageResponse<MedicationLogResponse> listByBatch(Long batchId, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "treatmentDate"));
        Page<MedicationLog> p = repo.findByBatch_Id(batchId, pageable);
        List<MedicationLogResponse> content = p.stream().map(mapper::toResponse).toList();
        return new PageResponse<>(content, p.getNumber(), p.getSize(), p.getTotalElements(), p.getTotalPages(), p.isFirst(), p.isLast());
    }

    @Transactional //(readOnly = true)
    public PageResponse<MedicationLogResponse> listByDateRange(LocalDate start, LocalDate end, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "treatmentDate"));
        Page<MedicationLog> p = repo.findByTreatmentDateBetween(start, end, pageable);
        List<MedicationLogResponse> content = p.stream().map(mapper::toResponse).toList();
        return new PageResponse<>(content, p.getNumber(), p.getSize(), p.getTotalElements(), p.getTotalPages(), p.isFirst(), p.isLast());
    }

    @Transactional //(readOnly = true)
    public PageResponse<MedicationLogResponse> searchByDiagnosis(String query, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "treatmentDate"));
        Page<MedicationLog> p = repo.findByDiagnosisContainingIgnoreCase(query, pageable);
        List<MedicationLogResponse> content = p.stream().map(mapper::toResponse).toList();
        return new PageResponse<>(content, p.getNumber(), p.getSize(), p.getTotalElements(), p.getTotalPages(), p.isFirst(), p.isLast());
    }

    @Transactional //(readOnly = true)
    public PageResponse<MedicationLogResponse> searchByMedication(String query, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "treatmentDate"));
        Page<MedicationLog> p = repo.findByMedicationContainingIgnoreCase(query, pageable);
        List<MedicationLogResponse> content = p.stream().map(mapper::toResponse).toList();
        return new PageResponse<>(content, p.getNumber(), p.getSize(), p.getTotalElements(), p.getTotalPages(), p.isFirst(), p.isLast());
    }
}
