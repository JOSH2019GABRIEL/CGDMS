package com.cgdms.CGDMS.broiler.thinningevent;

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
public class ThinningEventService {

    @Autowired
    private ThinningEventMapperService mapper;

    @Autowired
    private ThinningEventRepository thinningEventRepository;

    @Autowired
    private FlockRepository flockRepository;

    @Autowired
    private UserRepository userRepository;

    public ThinningEventRequest saveThinningEvent(ThinningEventRequest request) {
        ThinningEvent event;

        if (request.getId() != null) {
            // update existing thinning event
            event = thinningEventRepository.findById(request.getId())
                    .orElseThrow(() -> new EntityNotFoundException("ThinningEvent not found with id: " + request.getId()));

            event.setDate(request.getDate());
            event.setNumberRemoved(request.getNumberRemoved());
            event.setAverageWeight(request.getAverageWeight());
            event.setDestination(request.getDestination());

            if (request.getFlockId() != null) {
                Flock flock = flockRepository.findById(request.getFlockId())
                        .orElseThrow(() -> new EntityNotFoundException("Flock not found with id: " + request.getFlockId()));
                event.setFlock(flock);
            }

//            if (request.getOperatorId() != null) {
//                User operator = userRepository.findById(request.getOperatorId())
//                        .orElseThrow(() -> new EntityNotFoundException("Operator not found with id: " + request.getOperatorId()));
//                event.setOperatorId(operator);
//            }

        } else {
            // create new thinning event
            event = mapper.toEntity(request);

            if (request.getFlockId() != null) {
                Flock flock = flockRepository.findById(request.getFlockId())
                        .orElseThrow(() -> new EntityNotFoundException("Flock not found with id: " + request.getFlockId()));
                event.setFlock(flock);
            }

//            if (request.getOperatorId() != null) {
//                User operator = userRepository.findById(request.getOperatorId())
//                        .orElseThrow(() -> new EntityNotFoundException("Operator not found with id: " + request.getOperatorId()));
//                event.setOperatorId(operator);
//            }
        }

        thinningEventRepository.save(event);
        return request;
    }

    public PageResponse<ThinningEventResponse> findAllThinningEvents(int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdDate").descending());

        Page<ThinningEvent> events = thinningEventRepository.findAllNotArchived(pageable);

        List<ThinningEventResponse> responses = events.stream()
                .map(mapper::toResponse)
                .toList();

        return new PageResponse<>(
                responses,
                events.getNumber(),
                events.getSize(),
                events.getTotalElements(),
                events.getTotalPages(),
                events.isFirst(),
                events.isLast()
        );
    }


    public ThinningEventResponse findById(Long thinningEventId) {
        return thinningEventRepository.findById(thinningEventId)
                .map(mapper::toResponse)
                .orElseThrow(() -> new EntityNotFoundException("ThinningEvent not found with id: " + thinningEventId));
    }


    public void deleteThinningEvent(Long thinningEventId) {
        ThinningEvent event = thinningEventRepository.findById(thinningEventId)
                .orElseThrow(() -> new EntityNotFoundException("ThinningEvent not found with id: " + thinningEventId));

        event.setArchived(1);
        thinningEventRepository.save(event);
    }
}
