package com.minh.shopee.domain.dto.response.projection;

import java.util.Set;

import com.minh.shopee.domain.model.Permission;

public interface RoleProjection {
    Long getId();

    String getName();

    Set<Permission> getPermissions();
}
