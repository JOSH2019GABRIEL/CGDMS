package com.cgdms.CGDMS.farm;

import com.cgdms.CGDMS.organization.Organization;
import com.cgdms.CGDMS.organization.OrganizationRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class FarmService {

    private final FarmRepository farmRepository;
    private final OrganizationRepository organizationRepository;

    public FarmResponse create(FarmRequest request) {
        Organization organization = organizationRepository.findById(request.getOrganizationId())
                .orElseThrow(() -> new EntityNotFoundException("Organization not found with id " + request.getOrganizationId()));

        Farm farm = FarmMapper.toEntity(request, organization);
        return FarmMapper.toResponse(farmRepository.save(farm));
    }

    public List<FarmResponse> getAll() {
        return farmRepository.findAll()
                .stream()
                .map(FarmMapper::toResponse)
                .collect(Collectors.toList());
    }

    public FarmResponse getById(Long id) {
        Farm farm = farmRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Farm not found with id " + id));
        return FarmMapper.toResponse(farm);
    }

    public FarmResponse update(Long id, FarmRequest request) {
        Farm farm = farmRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Farm not found with id " + id));

        Organization organization = organizationRepository.findById(request.getOrganizationId())
                .orElseThrow(() -> new EntityNotFoundException("Organization not found with id " + request.getOrganizationId()));

        farm.setFarmName(request.getFarmName());
        farm.setLocation(request.getLocation());
        farm.setOrganization(organization);

        return FarmMapper.toResponse(farmRepository.save(farm));
    }

    public void delete(Long id) {
        if (!farmRepository.existsById(id)) {
            throw new EntityNotFoundException("Farm not found with id " + id);
        }
        farmRepository.deleteById(id);
    }
}
