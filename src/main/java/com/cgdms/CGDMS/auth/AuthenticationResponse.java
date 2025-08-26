package com.cgdms.CGDMS.auth;

import com.cgdms.CGDMS.role.Role;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Setter
@Getter
@Builder
public class AuthenticationResponse {

    private String token;
    private List<String> roles;
}
