package com.cgdms.CGDMS.common;

import com.cgdms.CGDMS.user.User;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

@Component
public class AuthUtils {

    /**
     * Get the currently authenticated user from the SecurityContext.
     */
    public User getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (authentication == null || !(authentication.getPrincipal() instanceof User)) {
            throw new IllegalStateException("No logged-in user found in security context");
        }

        return (User) authentication.getPrincipal();
    }

    /**
     * Get the ID of the currently logged-in user.
     */
    public Integer getCurrentUserId() {
        return getCurrentUser().getId();
    }

    /**
     * Get the email of the currently logged-in user.
     */
    public String getCurrentUserEmail() {
        return getCurrentUser().getEmail();
    }

    /**
     * Get the farmId of the currently logged-in user (if applicable).
     */
    public Long getCurrentUserFarmId() {
        User user = getCurrentUser();

        if (user.getFarm() == null) {
            throw new IllegalStateException("Logged-in user is not associated with any farm");
        }

        return user.getFarm().getId();
    }

    /**
     * Check if the logged-in user has the ADMIN role.
     */
    public boolean isAdmin() {
        User user = getCurrentUser();
        return user.getAuthorities().stream()
                .anyMatch(auth -> auth.getAuthority().equalsIgnoreCase("ROLE_ADMIN"));
    }

    /**
     * Check if the logged-in user has a specific role.
     */
    public boolean hasRole(String roleName) {
        User user = getCurrentUser();
        return user.getAuthorities().stream()
                .anyMatch(auth -> auth.getAuthority().equalsIgnoreCase(roleName));
    }
}
