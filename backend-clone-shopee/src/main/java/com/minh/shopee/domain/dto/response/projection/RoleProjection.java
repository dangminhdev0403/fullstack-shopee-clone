package com.minh.shopee.domain.dto.response.projection;

import java.util.Set;

public interface RoleProjection {
    Long getId();

    String getName();

    Set<PermissionProjection> getPermissions();
}
