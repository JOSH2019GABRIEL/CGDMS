package com.cgdms.CGDMS.farm;

import com.cgdms.CGDMS.organization.Organization;
import org.springframework.stereotype.Service;

@Service
public class FarmMapper {

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
                .name(farm.getFarmName())
                .location(farm.getLocation())
                .organizationName(farm.getOrganization() != null ? farm.getOrganization().getName() : null)
                .build();
    }
}