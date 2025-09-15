package com.cgdms.CGDMS.farm;

import com.cgdms.CGDMS.organization.Organization;
import com.cgdms.CGDMS.organization.OrganizationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class FarmMapper {

    private final OrganizationRepository orgRepo;

    public static Farm toEntity(FarmRequest request, Organization organization) {
        return Farm.builder()
                .farmName(request.getFarmName())
                .location(request.getLocation())
                .organization(organization)
                .build();
    }

    public static FarmResponse toResponse(Farm farm) {
        return FarmResponse.builder()
                .id(farm.getId())
                .farmName(farm.getFarmName())
                .location(farm.getLocation())
                .sizeInHectares(farm.getSizeInHectares())
                .organizationId(farm.getOrganization() != null ? farm.getOrganization().getId() : null)
                .build();
    }

}