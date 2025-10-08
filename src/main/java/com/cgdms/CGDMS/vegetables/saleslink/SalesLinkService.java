package com.cgdms.CGDMS.vegetables.saleslink;

import com.cgdms.CGDMS.common.PageResponse;
import com.cgdms.CGDMS.vegetables.harvestBatch.HarvestBatch;
import com.cgdms.CGDMS.vegetables.harvestBatch.HarvestBatchRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class SalesLinkService {

    @Autowired
    private SalesLinkRepository salesLinkRepository;

    @Autowired
    private HarvestBatchRepository harvestBatchRepository;

    @Autowired
    private SalesLinkMapper mapper;

    public SalesLinkRequest saveSalesLink(SalesLinkRequest request) {
        SalesLink link;
        HarvestBatch harvestBatch = null;

        if (request.getId() != null) {
            link = salesLinkRepository.findById(request.getId())
                    .orElseThrow(() -> new EntityNotFoundException("Sales link not found with id: " + request.getId()));


            if (request.getHarvestBatchId() != null){
                harvestBatch = harvestBatchRepository.findById(request.getHarvestBatchId())
                        .orElseThrow(()-> new EntityNotFoundException("Harvest batch not found with id: " + request.getHarvestBatchId()));
            }

            if (harvestBatch != null){
                link.setHarvestBatch(harvestBatch);
            }
            link.setSalesInvoice(request.getSalesInvoice());
            link.setMarketDestination(request.getMarketDestination());
        } else {
            link = mapper.toEntity(request, harvestBatch);
        }

        link.setArchived(0);
        salesLinkRepository.save(link);
        return request;
    }

    public PageResponse<SalesLinkResponse> findAll(int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("harvestId").descending());
        Page<SalesLink> list = salesLinkRepository.findAllNotArchived(pageable);
        List<SalesLinkResponse> responses = list.stream().map(mapper::toResponse).toList();
        return new PageResponse<>(responses, list.getNumber(), list.getSize(),
                list.getTotalElements(), list.getTotalPages(), list.isFirst(), list.isLast());
    }

    public SalesLinkResponse findById(Long id) {
        return salesLinkRepository.findById(id)
                .map(mapper::toResponse)
                .orElseThrow(() -> new EntityNotFoundException("Sales link not found with id: " + id));
    }

    public void delete(Long id) {
        SalesLink link = salesLinkRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Sales link not found with id: " + id));
        link.setArchived(1);
        salesLinkRepository.save(link);
    }
}

