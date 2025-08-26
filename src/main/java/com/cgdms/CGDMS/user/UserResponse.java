package com.cgdms.CGDMS.user;

import jakarta.persistence.Column;
import lombok.*;

import java.time.LocalDate;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class UserResponse {

    private Integer id;
    private String firstname;
    private String lastname;
    private String cadre; // Technician, Supervisor, Manager
    private String phone;
    private LocalDate dateOfBirth;
    @Column(unique = true)
    private String email;
    private String password;
    private boolean enabled;
    private boolean accountLocked;


}
