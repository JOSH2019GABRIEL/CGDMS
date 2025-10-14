package com.cgdms.CGDMS.role;

import com.cgdms.CGDMS.common.AuthUtils;
import com.cgdms.CGDMS.user.User;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class RoleService {

    private final RoleRepository roleRepository;
    private final RoleMapperService roleMapperService;
    private final AuthUtils authUtils;

    public List<RoleResponse> getAllRoles() {
        User loggedInUser = authUtils.getCurrentUser();
        boolean isAdmin = authUtils.isAdmin();
        Long farmId = authUtils.getCurrentUserFarmId();

        return roleRepository.findActiveRoleNames()  // custom query (see below)
                .stream()
                .map(roleMapperService::toRoleResponse)
                .toList();
    }
}
