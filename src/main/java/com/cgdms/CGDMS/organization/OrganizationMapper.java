package com.cgdms.CGDMS.organization;


import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class OrganizationMapper {


    public Organization toEntity(OrganizationRequest request) {
        return Organization.builder()
                .name(request.getName())
                .contactEmail(request.getContactEmail())
                .address(request.getAddress())
                .contactPhone(request.getContactPhone())
                .archived(0)
                .build();
    }

    public OrganizationResponse toResponse(Organization organization) {
        return OrganizationResponse.builder()
                .id(organization.getId())
                .name(organization.getName())
                .contactEmail(organization.getContactEmail())
                .address(organization.getAddress())
                .contactPhone(organization.getContactPhone())
                .build();
    }
}