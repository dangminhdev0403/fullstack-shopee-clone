package com.minh.shopee.domain.dto.request;

import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class UpdateShopDTO {

    private String shopName;
    private String email;
    private String shippingAddress;
    private String phone;
    private Long cityId;
    private Long districtId;
    private String wardCode;
}
