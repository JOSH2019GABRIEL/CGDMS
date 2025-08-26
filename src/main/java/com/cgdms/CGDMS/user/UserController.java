package com.cgdms.CGDMS.user;

import com.cgdms.CGDMS.common.PageResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.mail.MessagingException;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping("staff")
@Tag(name = "staff Registration")
public class UserController {

    @Autowired
    private UserService userService;

  @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody @Valid RegistrationRequest request) throws MessagingException {
        userService.register(request);

        return ResponseEntity.accepted().build();
    }


    @GetMapping("/activate-account")
    public void confirm (@RequestParam String token) throws MessagingException {
        userService.activateAccount(token);
    }

    @GetMapping
    public ResponseEntity<PageResponse<UserResponse>> findAllStaffs(
            @RequestParam(name = "page", defaultValue = "0", required = false) int page,
            @RequestParam(name = "size", defaultValue = "10", required = false) int size
    ) {
        return ResponseEntity.ok(userService.findAllStaff(page, size));
    }

    @GetMapping("/{staff-id}")
    public ResponseEntity<UserResponse> getStaff(@PathVariable("staff-id") Integer staffId) {
        return ResponseEntity.ok(userService.findById(staffId));
    }

    @PutMapping("/{id}")
    public ResponseEntity<UserResponse> updateUser(
            @PathVariable Integer id,
            @RequestBody UpdateUserRequest request,
            @AuthenticationPrincipal User loggedInUser) {
        UserResponse response = userService.updateUser(id, request, loggedInUser);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/change-password")
    public ResponseEntity<?> changePassword(
            @AuthenticationPrincipal User loggedInUser,
            @RequestBody @Valid ChangePasswordRequest request) {

        userService.changePassword(loggedInUser, request);
        return ResponseEntity.ok("Password changed successfully");
    }

    // Optional: ADMIN reset password for a staff
    @PutMapping("/{id}/reset-password")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<?> resetPassword(
            @PathVariable Integer id,
            @RequestBody String newPassword) {

        userService.adminResetPassword(id, newPassword);
        return ResponseEntity.ok("Password reset successfully by ADMIN");
    }

    @PutMapping("/archive/{id}")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<?> unarchiveUser(@PathVariable Integer id) {
        userService.deleteUser(id);
        return ResponseEntity.ok("User delete successfully");
    }


}
