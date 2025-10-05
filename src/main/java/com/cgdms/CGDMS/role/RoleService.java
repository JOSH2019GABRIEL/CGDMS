package com.cgdms.CGDMS.role;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class RoleService {

    private final RoleRepository roleRepository;
    private final RoleMapperService roleMapperService;

    public List<RoleResponse> getAllRoles() {
        return roleRepository.findActiveRoleNames()  // custom query (see below)
                .stream()
                .map(roleMapperService::toRoleResponse)
                .toList();
    }
}
