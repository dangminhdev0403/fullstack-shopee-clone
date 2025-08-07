package com.minh.shopee.domain.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AddressFullResponse {
    private Long id;
    private String name;
    private String phone;
    private String addressDetail;
    private Long provinceId;
    private Long districtId;
    private Long wardId;
    private Boolean isDefault;
    private String type;
    private String fullAddress;
}
