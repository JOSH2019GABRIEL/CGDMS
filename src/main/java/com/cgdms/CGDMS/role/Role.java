package com.cgdms.CGDMS.role;

import com.cgdms.CGDMS.base.BaseEntity;
import com.cgdms.CGDMS.user.User;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@SuperBuilder
@AllArgsConstructor
@NoArgsConstructor
@Entity
@EntityListeners(AuditingEntityListener.class)
public class Role extends BaseEntity {

    @Column(unique = true)
    private String name;

    @ManyToMany(mappedBy = "roles")
    @JsonIgnore
    private List<User> users;

}
