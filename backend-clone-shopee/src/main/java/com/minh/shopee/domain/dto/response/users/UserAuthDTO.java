package com.minh.shopee.domain.dto.response.users;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class UserAuthDTO {
    private String email;
    private String password;
}
