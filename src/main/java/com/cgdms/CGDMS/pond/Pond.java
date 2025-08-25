package com.cgdms.CGDMS.pond;


import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;


@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@SuperBuilder
public class Pond {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(nullable = false, unique = true)
    private String name;
    private Integer capacity;
    private String location;
    private String status; // ACTIVE, INACTIVE
//    private OffsetDateTime createdAt;
//    private OffsetDateTime updatedAt;
//    @PrePersist void preP(){ this.createdAt = OffsetDateTime.now(); }
//    @PreUpdate void preU(){ this.updatedAt = OffsetDateTime.now(); }
}
