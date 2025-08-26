package com.cgdms.CGDMS.user;

import lombok.*;

import java.time.LocalDate;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class UpdateUserRequest {

    private String firstname;
    private String lastname;
    private String cadre;
    private String phone;
    private LocalDate dateOfBirth;
//    private Boolean enabled;
}
