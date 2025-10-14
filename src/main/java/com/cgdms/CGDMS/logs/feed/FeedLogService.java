package com.cgdms.CGDMS.logs.feed;

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
public class FeedLogService {

    private final FeedLogRepository repo;
    private final FeedLogMapper mapper;
    private final AuthUtils authUtils;

    @Transactional
    public FeedLogResponse create(FeedLogRequest req) {
        FeedLog entity = mapper.toFeedLog(req);
        FeedLog saved = repo.save(entity);
        return mapper.toResponse(saved);
    }

    @Transactional
    public FeedLogResponse update(Long id, FeedLogRequest req) {
        FeedLog existing = repo.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Feed log not found with id: " + id));
        mapper.applyUpdate(existing, req);
        FeedLog saved = repo.save(existing);
        return mapper.toResponse(saved);
    }

    @Transactional
    public void delete(Long id) {
        if (!repo.existsById(id)) {
            throw new EntityNotFoundException("Feed log not found with id: " + id);
        }
        repo.deleteById(id);
    }

    public void deleteFeedLog (Long feedLogId) {
        FeedLog feedLog = repo.findById(feedLogId).orElseThrow(()-> new RuntimeException("Feed Log not found"));
        feedLog.setArchived(1);
        repo.save(feedLog);
    }

    @Transactional //(readOnly = true)
    public FeedLogResponse findById(Long id) {
        FeedLog f = repo.findById(id).orElseThrow(() -> new EntityNotFoundException("Feed log not found with id: " + id));
        return mapper.toResponse(f);
    }

    @Transactional //(readOnly = true)
    public PageResponse<FeedLogResponse> findAll(int page, int size) {
        User loggedInUser = authUtils.getCurrentUser();
        boolean isAdmin = authUtils.isAdmin();
        Long farmId = authUtils.getCurrentUserFarmId();


        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "date", "createdDate"));
        Page<FeedLog> p = isAdmin ? repo.findAllNotArchived(pageable, farmId) : repo.findAllNotArchivedForUsers(pageable, loggedInUser.getId(), farmId);
        List<FeedLogResponse> content = p.stream().map(mapper::toResponse).toList();
        return new PageResponse<>(content, p.getNumber(), p.getSize(), p.getTotalElements(), p.getTotalPages(), p.isFirst(), p.isLast());
    }

    @Transactional //(readOnly = true)
    public PageResponse<FeedLogResponse> findByPond(Long pondId, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "date"));
        Page<FeedLog> p = repo.findByPond_Id(pondId, pageable);
        List<FeedLogResponse> content = p.stream().map(mapper::toResponse).toList();
        return new PageResponse<>(content, p.getNumber(), p.getSize(), p.getTotalElements(), p.getTotalPages(), p.isFirst(), p.isLast());
    }

    @Transactional //(readOnly = true)
    public PageResponse<FeedLogResponse> findByBatch(Long batchId, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "date"));
        Page<FeedLog> p = repo.findByBatch_Id(batchId, pageable);
        List<FeedLogResponse> content = p.stream().map(mapper::toResponse).toList();
        return new PageResponse<>(content, p.getNumber(), p.getSize(), p.getTotalElements(), p.getTotalPages(), p.isFirst(), p.isLast());
    }

    @Transactional //(readOnly = true)
    public PageResponse<FeedLogResponse> findByDateRange(LocalDate start, LocalDate end, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "dateCreated"));
        Page<FeedLog> p = repo.findByDateBetween(start, end, pageable);
        List<FeedLogResponse> content = p.stream().map(mapper::toResponse).toList();
        return new PageResponse<>(content, p.getNumber(), p.getSize(), p.getTotalElements(), p.getTotalPages(), p.isFirst(), p.isLast());
    }
}