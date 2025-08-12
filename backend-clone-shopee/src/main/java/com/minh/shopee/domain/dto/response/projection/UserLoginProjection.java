package com.minh.shopee.domain.dto.response.projection;

import java.util.Set;

public interface UserLoginProjection {
    Long getId();

    String getEmail();

    String getName();

    Set<RoleProjection> getRoles();
}
