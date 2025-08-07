package com.minh.shopee.domain.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class AddAddressDTO {
    @NotBlank(message = "Tên không được để trống")
    private String name;

    @NotBlank(message = "Số điện thoại không được để trống")
    private String phone;

    @NotBlank(message = "Địa chỉ chi tiết không được để trống")
    private String addressDetail;

    @NotNull(message = "Mã tỉnh không được để trống")
    private Long provinceId;

    @NotNull(message = "Mã huyện không được để trống")
    private Long districtId;

    @NotNull(message = "Mã xã không được để trống")
    private Long wardId;

    @NotBlank(message = "Địa chỉ đầy đủ không được để trống")
    private String fullAddress;
    
    private Boolean isDefault = false;

    private String type = "home"; // home, office, other
}
