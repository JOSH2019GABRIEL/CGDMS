package com.cgdms.CGDMS.role;

import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("roles")
@Tag(name = "Roles")
@RequiredArgsConstructor
public class RoleController {

    private final RoleService roleService;


    @GetMapping
    public List<RoleResponse> getRoles() {
        System.out.println("Roles here"+ roleService.getAllRoles());
        return roleService.getAllRoles();
    }
}
