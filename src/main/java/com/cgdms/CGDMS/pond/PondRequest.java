package com.cgdms.CGDMS.pond;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.Column;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
public class PondRequest {


    private Long id;
    @NotBlank(message = "name of pond cannot be blank")
    @NotEmpty(message = "name of pond cannot be empty")
    @Column(nullable = false, unique = true)
    private String name;
    @NotNull(message = "Pond capacity is required")
    private Integer capacity;
    @NotBlank(message = "pond location cannot be blank")
    @NotEmpty(message = "pond location cannot be empty")
    private String location;
    @NotBlank(message = "pond status cannot be blank")
    @NotEmpty(message = "pond status cannot be empty")
    private String status; // ACTIVE, INACTIVE
    @JsonIgnore
    private Integer archived = 0;

}
