package com.cgdms.CGDMS.config;

import com.cgdms.CGDMS.base.BaseEntity;
import com.cgdms.CGDMS.farm.Farm;
import com.cgdms.CGDMS.user.User;
import jakarta.persistence.PrePersist;
import org.springframework.security.authentication.AnonymousAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

@Component
public class FarmAwareEntityListener {

    @PrePersist
    public void setFarmOnCreate(BaseEntity entity) {
        if (entity.getFarm() == null) {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            if (authentication != null && authentication.isAuthenticated()
                    && !(authentication instanceof AnonymousAuthenticationToken)) {

                User user = (User) authentication.getPrincipal();
                if (user.getFarm() != null) {
                    Farm farm = new Farm();
                    farm.setId(user.getFarm().getId());
                    entity.setFarm(farm);
                }
            }
        }
    }
}
