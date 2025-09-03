package com.cgdms.CGDMS.organization;

import lombok.Data;

@Data
public class OrganizationRequest {

    private String name;
    private String address;
    private String contactEmail;
    private String contactPhone;
}
