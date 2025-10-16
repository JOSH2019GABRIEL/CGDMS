package com.cgdms.CGDMS.user;

import com.cgdms.CGDMS.cadre.Cadre;
import com.cgdms.CGDMS.cadre.CadreRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserMapperService {

    private final CadreRepository cadreRepository;

    public User toUser(UserRequest userRequest){

        Cadre cadre = cadreRepository.findById(userRequest.getCadreId())
                .orElseThrow(() -> new IllegalStateException("Cadre not found with ID: " + userRequest.getCadreId()));


        return User.builder()
                .id(userRequest.getId())
                .firstname(userRequest.getFirstname())
                .lastname(userRequest.getLastname())
                .cadre(cadre)
                .phone(userRequest.getPhone())
                .dateOfBirth(userRequest.getDateOfBirth())
                .email(userRequest.getEmail())
                .password(userRequest.getPassword())
                .archived(0)
                .build();
    }

    public UserResponse toUserResponse(User user){
        return UserResponse.builder()
                .id(user.getId())
                .firstname(user.getFirstname())
                .lastname(user.getLastname())
                .cadreId(user.getCadre() != null ? user.getCadre().getId() : null)
                .cadre(user.getCadre() != null ? user.getCadre().getCadreName() : null)
                .rate(user.getCadre() != null ? user.getCadre().getRate() : null)
                .roleId(user.getRole() != null ? user.getRole().getId() : null)
                .farmId(user.getFarm() != null ? user.getFarm().getId() : null)

                .phone(user.getPhone())
                .dateOfBirth(user.getDateOfBirth())
                .email(user.getEmail())
                .password(user.getPassword())
                .enabled(user.isEnabled())
                .build();
    }

}
