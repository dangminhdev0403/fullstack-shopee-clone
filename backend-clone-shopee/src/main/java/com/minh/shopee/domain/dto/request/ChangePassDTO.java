package com.minh.shopee.domain.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class ChangePassDTO {

    @NotBlank(message = "Old password is required")
    private String oldPassword;
    @NotBlank(message = "New password is required")
    private String newPassword;
    @NotBlank(message = "Confirm password is required")
    private String confirmPassword;
}
