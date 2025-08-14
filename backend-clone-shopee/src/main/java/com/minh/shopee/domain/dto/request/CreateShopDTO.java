package com.minh.shopee.domain.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class CreateShopDTO {

    @NotBlank(message = "Shop name is required")
    private String shopName;
    @NotBlank(message = "Shop email is required")
    private String email;
    @NotBlank(message = "shippingAddress is required")
    private String shippingAddress;
    @NotBlank(message = "phone is required")
    @Pattern(regexp = "0\\d{9}", message = "phone must be 10 digits starting with 0")
    private String phone;
    @NotNull(message = "cityId is required")
    private Long cityId;
    @NotNull(message = "districtId is required")
    private Long districtId;
    @NotBlank(message = "wardCode is required")
    private String wardCode;
}
