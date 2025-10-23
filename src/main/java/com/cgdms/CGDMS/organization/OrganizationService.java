package com.cgdms.CGDMS.organization;

import com.cgdms.CGDMS.common.AuthUtils;
import com.cgdms.CGDMS.common.PageResponse;
import com.cgdms.CGDMS.user.User;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class OrganizationService {

    private final OrganizationRepository organizationRepository;
    private final AuthUtils authUtils;
    private final OrganizationMapper organizationMapper; // ✅ dependency injected instance

    public OrganizationResponse create(OrganizationRequest request) {
        // ✅ use instance method instead of static
        Organization org = organizationMapper.toEntity(request);
        return organizationMapper.toResponse(organizationRepository.save(org));
    }

//    public List<OrganizationResponse> getAll() {
//        return organizationRepository.findAll()
//                .stream()
//                .map(organizationMapper::toResponse)
//                .collect(Collectors.toList());
//    }

    public OrganizationResponse getById(Long id) {
        Organization org = organizationRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Organization not found with id " + id));
        return organizationMapper.toResponse(org);
    }

    public OrganizationResponse update(Long id, OrganizationRequest request) {
        Organization org = organizationRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Organization not found with id " + id));
        org.setName(request.getName());
        org.setAddress(request.getAddress());
        org.setContactEmail(request.getContactEmail());
        org.setContactPhone(request.getContactPhone());
        return organizationMapper.toResponse(organizationRepository.save(org));
    }

    public void delete(Long id) {
        if (!organizationRepository.existsById(id)) {
            throw new EntityNotFoundException("Organization not found with id " + id);
        }
        organizationRepository.deleteById(id);
    }

    public void archiveOrganization(Long orgId) {
        Organization organization = organizationRepository.findById(orgId)
                .orElseThrow(() -> new RuntimeException("Organization not found"));
        organization.setArchived(1);
        organizationRepository.save(organization);
    }

    public PageResponse<OrganizationResponse> findAllOrganization(int page, int size) {
        User loggedInUser = authUtils.getCurrentUser();
        boolean isAdmin = authUtils.isAdmin();
        Long farmId = authUtils.getCurrentUserFarmId();

        Pageable pageable = PageRequest.of(page, size, Sort.by("createdDate").descending());

        Page<Organization> organizations = isAdmin
                ? organizationRepository.findAllNotArchived(pageable, farmId)
                : organizationRepository.findAllNotArchivedForUsers(pageable, farmId, loggedInUser.getId());

        List<OrganizationResponse> responses = organizations.stream()
                .map(organizationMapper::toResponse)
                .toList();

        return new PageResponse<>(
                responses,
                organizations.getNumber(),
                organizations.getSize(),
                organizations.getTotalElements(),
                organizations.getTotalPages(),
                organizations.isFirst(),
                organizations.isLast()
        );
    }
}
