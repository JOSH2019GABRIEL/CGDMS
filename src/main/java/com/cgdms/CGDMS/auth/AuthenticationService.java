package com.cgdms.CGDMS.auth;


import com.cgdms.CGDMS.role.Role;
import com.cgdms.CGDMS.security.JWTService;
import com.cgdms.CGDMS.user.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;

@Service
//@RequiredArgsConstructor
public class AuthenticationService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private AuthenticationManager authenticationManager;
    @Autowired
    private JWTService jwtService;


    public AuthenticationResponse authenticate(AuthenticationRequest request) {
        var auth = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getPassword()
                )
        );
        var claims = new HashMap<String, Object>();
        var user = ((User)auth.getPrincipal());
        claims.put("fullName", user.fullName());
        claims.put("role", user.getRoles().stream().map(Role::getName).toList());
        var jwtToken = jwtService.generateToken(claims, user);
        return AuthenticationResponse.builder()
                .token(jwtToken)
                .roles(user.getRoles().stream()
                        .map(Role::getName)
                        .toList())
                .build();


    }



    public List<User> fetchUsers() {
        return userRepository.findAll();

    }
}
