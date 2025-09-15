package com.cgdms.CGDMS.common;

import com.cgdms.CGDMS.role.Role;
import com.cgdms.CGDMS.role.RoleRepository;
import com.cgdms.CGDMS.user.User;
import com.cgdms.CGDMS.user.UserRepository;
import com.cgdms.CGDMS.farm.Farm;
import com.cgdms.CGDMS.farm.FarmRepository;
import com.cgdms.CGDMS.user.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Configuration
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final RoleRepository roleRepository;
    private final UserRepository userRepository;
    private final FarmRepository farmRepository;
    private final PasswordEncoder passwordEncoder;
    private final UserService userService;

    @Override
    public void run(String... args) throws Exception {
        // ✅ Create default roles if not exist
        Role adminRole = roleRepository.findByName("ROLE_ADMIN")
                .orElseGet(() -> roleRepository.save(Role.builder().name("ROLE_ADMIN")
                        .createdBy(0)
                        .createdDate(LocalDateTime.now())
                        .lastModifiedBy(0)
                        .lastModifiedDate(LocalDateTime.now())
                        .archived(0)
                        .build()));

        Role userRole = roleRepository.findByName("ROLE_USER")
                .orElseGet(() -> roleRepository.save(Role.builder().name("ROLE_USER")
                                .createdBy(0)
                                .createdDate(LocalDateTime.now())
                                .lastModifiedBy(0)
                                .lastModifiedDate(LocalDateTime.now())
                                .archived(0)
                        .build()));

        // ✅ Ensure we have at least one farm
        Farm defaultFarm = farmRepository.findByFarmName("Demo Farm")
                .orElseGet(() -> farmRepository.save(Farm.builder()
                        .farmName("Demo Farm")
                        .location("Abuja")
                        .sizeInHectares(100.0)
                        .createdBy(0)
                        .createdDate(LocalDateTime.now())
                        .lastModifiedBy(0)
                        .lastModifiedDate(LocalDateTime.now())
                        .archived(0)
                        .build()));

        // ✅ Create a default ADMIN user if not exist
        if (userRepository.findByEmail("admin@system.com").isEmpty()) {
            User admin = User.builder()
                    .firstname("System")
                    .lastname("Admin")
                    .cadre("Manager")
                    .phone("08012345678")
                    .dateOfBirth(LocalDate.of(1990, 1, 1))
                    .email("admin@system.com")
                    .password(passwordEncoder.encode("Admin123"))
                    .roles(List.of(adminRole))
                    .farm(defaultFarm)
                    .build();

            userRepository.save(admin);
            userService.sendValidationEmail(admin);
            System.out.println("Default ADMIN user created: admin@system.com / Admin123");
        }
    }
}

