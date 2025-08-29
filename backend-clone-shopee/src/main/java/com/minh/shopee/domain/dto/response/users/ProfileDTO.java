package com.minh.shopee.domain.dto.response.users;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
@AllArgsConstructor
public class ProfileDTO {
    private String name;
    private String email;

    private String avatarUrl;

}
