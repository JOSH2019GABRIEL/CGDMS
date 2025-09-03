package com.cgdms.CGDMS.organization;

import com.cgdms.CGDMS.farm.Farm;
import com.cgdms.CGDMS.farm.FarmRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class OrganizationMapper {

    private static final FarmRepository farmRepository = null;

    public static Organization toEntity(OrganizationRequest request) {

        return Organization.builder()
                .name(request.getName())
                .contactEmail(request.getContactEmail())
                .address(request.getAddress())
                .contactPhone(request.getContactPhone())
                .archived(0)
                .build();
    }

    public static OrganizationResponse toResponse(Organization organization) {
        return OrganizationResponse.builder()
                .id(organization.getId())
                .name(organization.getName())
                .contactEmail(organization.getContactEmail())
                .address(organization.getAddress())
                .contactPhone(organization.getContactPhone())
                .build();
    }
}