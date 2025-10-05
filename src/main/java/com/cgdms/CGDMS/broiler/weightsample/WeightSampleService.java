package com.cgdms.CGDMS.broiler.weightsample;

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
public class WeightSampleService {

    @Autowired
    private WeightSampleMapperService mapper;

    @Autowired
    private WeightSampleRepository weightSampleRepository;

    @Autowired
    private FlockRepository flockRepository;

    @Autowired
    private UserRepository userRepository;

    public WeightSampleRequest saveWeightSample(WeightSampleRequest request) {
        WeightSample sample;

        if (request.getId() != null) {
            sample = weightSampleRepository.findById(request.getId())
                    .orElseThrow(() -> new EntityNotFoundException("WeightSample not found with id: " + request.getId()));

            sample.setDate(request.getDate());
            sample.setSampleCount(request.getSampleCount());
            sample.setAvgWeightG(request.getAvgWeightG());
            sample.setSd(request.getSd());
            sample.setArchived(0);

            if (request.getFlockId() != null) {
                Flock flock = flockRepository.findById(request.getFlockId())
                        .orElseThrow(() -> new EntityNotFoundException("Flock not found with id: " + request.getFlockId()));
                sample.setFlock(flock);
            }

//            if (request.getOperatorId() != null) {
//                User operator = userRepository.findById(request.getOperatorId())
//                        .orElseThrow(() -> new EntityNotFoundException("Operator not found with id: " + request.getOperatorId()));
//                sample.setOperator(operator);
//            }

        } else {
            // create new weight sample
            sample = mapper.toEntity(request);

            if (request.getFlockId() != null) {
                Flock flock = flockRepository.findById(request.getFlockId())
                        .orElseThrow(() -> new EntityNotFoundException("Flock not found with id: " + request.getFlockId()));
                sample.setFlock(flock);
            }
            sample.setArchived(0);

//            if (request.getOperatorId() != null) {
//                User operator = userRepository.findById(request.getOperatorId())
//                        .orElseThrow(() -> new EntityNotFoundException("Operator not found with id: " + request.getOperatorId()));
//                sample.setOperator(operator);
//            }
        }

        weightSampleRepository.save(sample);
        return request;
    }

    public PageResponse<WeightSampleResponse> findAllWeightSamples(int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdDate").descending());

        Page<WeightSample> samples = weightSampleRepository.findAllNotArchived(pageable);

        List<WeightSampleResponse> responses = samples.stream()
                .map(mapper::toResponse)
                .toList();

        return new PageResponse<>(
                responses,
                samples.getNumber(),
                samples.getSize(),
                samples.getTotalElements(),
                samples.getTotalPages(),
                samples.isFirst(),
                samples.isLast()
        );
    }

    public WeightSampleResponse findById(Long weightSampleId) {
        return weightSampleRepository.findById(weightSampleId)
                .map(mapper::toResponse)
                .orElseThrow(() -> new EntityNotFoundException("WeightSample not found with id: " + weightSampleId));
    }

    public void deleteWeightSample(Long weightSampleId) {
        WeightSample sample = weightSampleRepository.findById(weightSampleId)
                .orElseThrow(() -> new EntityNotFoundException("WeightSample not found with id: " + weightSampleId));

        sample.setArchived(1);
        weightSampleRepository.save(sample);
    }
}
