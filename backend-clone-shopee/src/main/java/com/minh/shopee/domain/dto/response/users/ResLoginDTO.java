package com.minh.shopee.domain.dto.response.users;

import java.util.Set;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.minh.shopee.domain.dto.response.projection.RoleProjection;
import com.minh.shopee.domain.dto.response.rbac.RoleDTO;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
public class ResLoginDTO {
    @JsonProperty("access_token")
    private String accessToken;

    private UserLogin user;

    @Getter
    @Setter
    @Builder
    public static class UserLogin {
        private long id;
        private String name;
        private String email;
        private Set<RoleDTO> roles;
    }
}
