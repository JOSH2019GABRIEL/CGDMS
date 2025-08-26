package com.cgdms.CGDMS.pond;


import com.cgdms.CGDMS.base.BaseEntity;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;


@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@SuperBuilder
public class Pond extends BaseEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(nullable = false, unique = true)
    private String name;
    private Integer capacity;
    private String location;
    private String status; // ACTIVE, INACTIVE

}
