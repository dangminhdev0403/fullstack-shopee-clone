package com.minh.shopee.domain.dto.request;

import jakarta.validation.constraints.Email;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserReqDTO {
    @Email(message = "Email không hợp lệ")
    private String email;
    private String currentPassword;
    private String newPassword;
    private String name;

}
