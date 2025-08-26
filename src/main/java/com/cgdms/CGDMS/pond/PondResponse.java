package com.cgdms.CGDMS.pond;

import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class PondResponse {

    private Long id;
    private String name;
    private Integer capacity;
    private String location;
    private String status;
    private Integer archived;

}
