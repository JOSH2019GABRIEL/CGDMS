package com.cgdms.CGDMS.logs.env;

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
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class EnvLogService {

    private final EnvLogRepository repo;
    private final EnvLogMapper mapper;
    private final AuthUtils authUtils;

    @Transactional
    public EnvLogResponse create(EnvLogRequest req, Authentication connectedUser) {
        User loggedInUser = ((User) connectedUser.getPrincipal());

        EnvLog e = mapper.toEntity(req);
        e.setStaff(loggedInUser);
        EnvLog saved = repo.save(e);
        return mapper.toResponse(saved);
    }

    @Transactional
    public EnvLogResponse update(Long id, EnvLogRequest req) {
        EnvLog existing = repo.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("EnvData not found with id: " + id));
        mapper.applyUpdate(existing, req);
        EnvLog saved = repo.save(existing);
        return mapper.toResponse(saved);
    }

    @Transactional
    public void delete(Long id) {
        if (!repo.existsById(id)) throw new EntityNotFoundException("EnvData not found with id: " + id);
        repo.deleteById(id);
    }

    @Transactional //(readOnly = true)
    public EnvLogResponse findById(Long id) {
        EnvLog e = repo.findById(id).orElseThrow(() -> new EntityNotFoundException("EnvData not found with id: " + id));
        return mapper.toResponse(e);
    }

    @Transactional //(readOnly = true)
    public PageResponse<EnvLogResponse> listAll(int page, int size) {
        User loggedInUser = authUtils.getCurrentUser();
        boolean isAdmin = authUtils.isAdmin();
        Long farmId = authUtils.getCurrentUserFarmId();

        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "measuredAt", "createdDate"));
        Page<EnvLog> p = isAdmin ?  repo.findAllUnArchived(pageable, farmId) : repo.findAllNotArchivedForUsers(pageable, loggedInUser.getId(), farmId);
        List<EnvLogResponse> content = p.stream().map(mapper::toResponse).toList();
        return new PageResponse<>(content, p.getNumber(), p.getSize(), p.getTotalElements(), p.getTotalPages(), p.isFirst(), p.isLast());
    }

    @Transactional //(readOnly = true)
    public PageResponse<EnvLogResponse> listByPond(Long pondId, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "measuredAt"));
        Page<EnvLog> p = repo.findByPond_Id(pondId, pageable);
        List<EnvLogResponse> content = p.stream().map(mapper::toResponse).toList();
        return new PageResponse<>(content, p.getNumber(), p.getSize(), p.getTotalElements(), p.getTotalPages(), p.isFirst(), p.isLast());
    }

    @Transactional  //(readOnly = true)
    public PageResponse<EnvLogResponse> listByDateRange(LocalDateTime start, LocalDateTime end, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "measuredAt"));
        Page<EnvLog> p = repo.findByMeasuredAtBetween(start, end, pageable);
        List<EnvLogResponse> content = p.stream().map(mapper::toResponse).toList();
        return new PageResponse<>(content, p.getNumber(), p.getSize(), p.getTotalElements(), p.getTotalPages(), p.isFirst(), p.isLast());
    }

    @Transactional //(readOnly = true)
    public PageResponse<EnvLogResponse> listByPondAndDateRange(Long pondId, LocalDateTime start, LocalDateTime end, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "measuredAt"));
        Page<EnvLog> p = repo.findByPond_IdAndMeasuredAtBetween(pondId, start, end, pageable);
        List<EnvLogResponse> content = p.stream().map(mapper::toResponse).toList();
        return new PageResponse<>(content, p.getNumber(), p.getSize(), p.getTotalElements(), p.getTotalPages(), p.isFirst(), p.isLast());
    }
}