package com.cgdms.CGDMS.auth;

import com.cgdms.CGDMS.security.JWTService;
import com.cgdms.CGDMS.user.User;
import com.cgdms.CGDMS.user.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;

@Service
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

        var user = (User) auth.getPrincipal();
        var claims = new HashMap<String, Object>();

        claims.put("fullName", user.fullName());
        claims.put("farm", user.getFarm() != null ? user.getFarm().getFarmName() : "No Farm");
        claims.put("org", user.getFarm() != null ? user.getFarm().getOrganization().getName() : "No Organization");
        claims.put("role", user.getRole() != null ? user.getRole().getName() : "No Role");

        var jwtToken = jwtService.generateToken(claims, user);

        return AuthenticationResponse.builder()
                .token(jwtToken)
                .farmName(user.getFarm() != null ? user.getFarm().getFarmName() : "No Farm")
                .roles(List.of(user.getRole() != null ? user.getRole().getName() : "No Role"))
                .organization(user.getFarm() != null ? user.getFarm().getOrganization().getName() : "No Organization")
                .build();
    }

    public List<User> fetchUsers() {
        return userRepository.findAll();
    }
}
