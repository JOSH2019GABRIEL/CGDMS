package com.cgdms.CGDMS.user;

import org.springframework.stereotype.Service;

@Service
public class UserMapperService {


    public User toUser(UserRequest userRequest){
        return User.builder()
                .id(userRequest.getId())
                .firstname(userRequest.getFirstname())
                .lastname(userRequest.getLastname())
                .cadre(userRequest.getCadre())
                .phone(userRequest.getPhone())
                .dateOfBirth(userRequest.getDateOfBirth())
                .email(userRequest.getEmail())
                .password(userRequest.getPassword())
                .build();
    }

    public UserResponse toUserResponse(User user){
        return UserResponse.builder()
                .id(user.getId())
                .firstname(user.getFirstname())
                .lastname(user.getLastname())
                .cadre(user.getCadre())
                .phone(user.getPhone())
                .dateOfBirth(user.getDateOfBirth())
                .email(user.getEmail())
                .password(user.getPassword())

                .build();
    }

}
