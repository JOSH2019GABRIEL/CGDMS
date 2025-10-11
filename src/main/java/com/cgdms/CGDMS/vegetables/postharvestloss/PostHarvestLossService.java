package com.cgdms.CGDMS.vegetables.postharvestloss;

import com.cgdms.CGDMS.common.PageResponse;
import com.cgdms.CGDMS.vegetables.harvestBatch.HarvestBatch;
import com.cgdms.CGDMS.vegetables.harvestBatch.HarvestBatchRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class PostHarvestLossService {

    @Autowired
    private PostharvestLossRepository postHarvestLossRepository;
    @Autowired
    private HarvestBatchRepository harvestBatchRepository;

    @Autowired
    private PostHarvestLossMapper mapper;

    public PostharvestLossRequest saveLoss(PostharvestLossRequest request) {
        PostharvestLoss loss;
        HarvestBatch harvestBatch = null;
        if (request.getId() != null) {
            loss = postHarvestLossRepository.findById(request.getId())
                    .orElseThrow(() -> new EntityNotFoundException("Post-harvest loss not found with id: " + request.getId()));

            if (request.getHarvestBatchId() != null){
                harvestBatch = harvestBatchRepository.findById(request.getHarvestBatchId())
                        .orElseThrow(()-> new EntityNotFoundException("Harvest batch not found with id: " + request.getHarvestBatchId()));
            }

//            loss.setHarvestId(request.getHarvestId());
            loss.setSpoilageKg(request.getSpoilageKg());
            loss.setTrimmingWasteKg(request.getTrimmingWasteKg());
            loss.setPestsDamageKg(request.getPestsDamageKg());

            if (harvestBatch != null){
                loss.setHarvest(harvestBatch);
            }
        } else {
            loss = mapper.toEntity(request, harvestBatch);
        }

        loss.setArchived(0);
        postHarvestLossRepository.save(loss);
        return request;
    }

    public PageResponse<PostharvestLossResponse> findAll(int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdDate").descending());
        Page<PostharvestLoss> list = postHarvestLossRepository.findAllNotArchived(pageable);
        List<PostharvestLossResponse> responses = list.stream().map(mapper::toResponse).toList();
        return new PageResponse<>(responses, list.getNumber(), list.getSize(),
                list.getTotalElements(), list.getTotalPages(), list.isFirst(), list.isLast());
    }

    public PostharvestLossResponse findById(Long id) {
        return postHarvestLossRepository.findById(id)
                .map(mapper::toResponse)
                .orElseThrow(() -> new EntityNotFoundException("Post-harvest loss not found with id: " + id));
    }

    public void delete(Long id) {
        PostharvestLoss loss = postHarvestLossRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Post-harvest loss not found with id: " + id));
        loss.setArchived(1);
        postHarvestLossRepository.save(loss);
    }
}
