package com.cgdms.CGDMS.organization;

import com.cgdms.CGDMS.batch.Batch;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class OrganizationService {

    private final OrganizationRepository organizationRepository;

    public OrganizationResponse create(OrganizationRequest request) {
        Organization org = OrganizationMapper.toEntity(request);
        return OrganizationMapper.toResponse(organizationRepository.save(org));
    }

    public List<OrganizationResponse> getAll() {
        return organizationRepository.findAll()
                .stream()
                .map(OrganizationMapper::toResponse)
                .collect(Collectors.toList());
    }

    public OrganizationResponse getById(Long id) {
        Organization org = organizationRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Organization not found with id " + id));
        return OrganizationMapper.toResponse(org);
    }

    public OrganizationResponse update(Long id, OrganizationRequest request) {
        Organization org = organizationRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Organization not found with id " + id));
        org.setName(request.getName());
        org.setAddress(request.getAddress());
        org.setContactEmail(request.getContactEmail());
        return OrganizationMapper.toResponse(organizationRepository.save(org));
    }

    public void delete(Long id) {
        if (!organizationRepository.existsById(id)) {
            throw new EntityNotFoundException("Organization not found with id " + id);
        }
        organizationRepository.deleteById(id);
    }

    public void archiveOrganization(Long orgId) {
        Organization organization = organizationRepository.findById(orgId).orElseThrow(()-> new RuntimeException("Organization not found"));
        organization.setArchived(1);
        organizationRepository.save(organization);
    }
}
