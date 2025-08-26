package com.cgdms.CGDMS.user;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.Column;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
@Builder
public class UserRequest {

    private Integer id;
    @NotBlank(message = "First name cannot be blank")
    @NotEmpty(message = "First name cannot be empty")
    private String firstname;
    @NotBlank(message = "Last name cannot be blank")
    @NotEmpty(message = "Last name cannot be empty")
    private String lastname;
    @NotBlank(message = "Cadre cannot be blank")
    @NotEmpty(message = "Cadre cannot be empty")
    private String cadre; // Technician, Supervisor, Manager
    @NotBlank(message = "Phone number cannot be blank")
    @NotEmpty(message = "Phone number cannot be empty")
    private String phone;
    @NotBlank(message = "Date of Birth cannot be blank")
    @NotEmpty(message = "Date of Birth cannot be empty")
    private LocalDate dateOfBirth;
    @Column(unique = true)
    @NotBlank(message = "Email cannot be blank")
    @NotEmpty(message = "Email cannot be empty")
    private String email;
    @NotBlank(message = "Password cannot be blank")
    @NotEmpty(message = "Password cannot be empty")
    private String password;

    @JsonIgnore
    private boolean accountLocked;
    @JsonIgnore
    private boolean enabled;
    @JsonIgnore
    private Integer archived = 0;


}
