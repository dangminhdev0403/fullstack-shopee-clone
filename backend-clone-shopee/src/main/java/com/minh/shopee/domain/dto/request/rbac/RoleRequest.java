package com.minh.shopee.domain.dto.request.rbac;

import java.util.Set;

import lombok.Getter;
import lombok.Setter;

@Setter
@Getter

public class RoleRequest {
    private Long id;
    private String name;
    private Set<Long> permissionIds;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

}
