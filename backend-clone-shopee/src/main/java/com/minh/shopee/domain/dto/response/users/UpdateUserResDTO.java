package com.minh.shopee.domain.dto.response.users;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

@Builder
@Getter
@AllArgsConstructor
public class UpdateUserResDTO {
    private String email;
    private String name;
    private String urlAvatar;

}
