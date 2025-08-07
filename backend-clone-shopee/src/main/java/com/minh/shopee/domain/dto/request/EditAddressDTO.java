package com.minh.shopee.domain.dto.request;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class EditAddressDTO {
    private Long id;

    private String name;
    private String phone;
    private String addressDetail;
    private Long provinceId;
    private Long districtId;
    private Long wardId;
    private String fullAddress;

    private Boolean isDefault;
    private String type;
}
