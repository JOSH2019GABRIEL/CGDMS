package com.cgdms.CGDMS.user;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.validation.constraints.*;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Builder
@Getter
@Setter
public class RegistrationRequest {

    @NotEmpty(message = "Firstname is mandatory")
    @NotBlank(message = "Firstname is mandatory")
    private String firstname;
    @NotEmpty(message = "Lastname is mandatory")
    @NotBlank(message = "Lastname is mandatory")
    private String lastname;
    @NotEmpty(message = "cadre is mandatory")
    @NotBlank(message = "cadre is mandatory")
    private Long cadre; // Technician, Supervisor, Manager
    @NotEmpty(message = "phone number is mandatory")
    @NotBlank(message = "phone number is mandatory")
    private String phone;
    @NotNull(message = "Date of birth is required")   // 👈 Use @NotNull for LocalDate
    @Past(message = "Date of birth must be in the past") // 👈 Extra safety
    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate dateOfBirth;
    @Email(message = "Email is not formatted")
    @NotEmpty(message = "Email is mandatory")
    @NotBlank(message = "Email is mandatory")
    private String email;
    @NotEmpty(message = "Password is mandatory")
    @NotBlank(message = "Password is mandatory")
    @Size(min = 8, message = "Password should be 8 character long minimum")
    private String password;
    private String confirmPassword;
    private Integer roleId;
    private Long farmId;



}
