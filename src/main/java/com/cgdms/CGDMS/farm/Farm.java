package com.cgdms.CGDMS.farm;


import com.cgdms.CGDMS.base.FarmBaseEntity;
import com.cgdms.CGDMS.broiler.flock.Flock;
import com.cgdms.CGDMS.organization.Organization;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

import java.util.ArrayList;
import java.util.List;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@SuperBuilder
public class Farm extends FarmBaseEntity {

    private String farmName;
    private String location;
    private double sizeInHectares;

    @ManyToOne
    @JoinColumn(name = "organization_id")
    private Organization organization;

    @OneToMany(mappedBy = "farm", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference // 👈 handles the “forward” side
    private List<Flock> flocks = new ArrayList<>();


//    @PrePersist
//    @PreUpdate
//    public void setFarm(BaseEntity entity) {
//        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
//        if (auth != null && auth.isAuthenticated() && auth.getPrincipal() instanceof User user) {
//            entity.setFarm(user.getFarm()); // ✅ Assign logged-in user's farm
//        }
//    }
}

