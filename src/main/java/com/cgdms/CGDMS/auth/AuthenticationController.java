package com.cgdms.CGDMS.auth;

import com.cgdms.CGDMS.user.UserService;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("auth")
@Tag(name = "Authentication")
public class AuthenticationController {

    @Autowired
    private AuthenticationService service;
    @Autowired
    private UserService userService;

    @PostMapping("/authenticate")
    public ResponseEntity<AuthenticationResponse> authenticate (@RequestBody @Valid AuthenticationRequest request) {
        return ResponseEntity.ok(service.authenticate(request));

    }
    @PutMapping("/{userEmail}/reset-password")
    public ResponseEntity<?> resetPassword(@Valid @PathVariable String userEmail) {
        userService.userResetPassword(userEmail);
        return ResponseEntity.ok("Password reset successfully");
    }


//    @PutMapping("/{email}/reset-password")
////    @PreAuthorize("hasAuthority('ADMIN')")
//    public ResponseEntity<?> resetPassword(
//            @PathVariable String userEmail) {
//
//        userService.userResetPassword(userEmail);
//        return ResponseEntity.ok("Password reset successfully");
//    }

//    @GetMapping("/activate-account")
//    public void confirm (@RequestParam String token) throws MessagingException {
//        service.activateAccount(token);
//    }

}
