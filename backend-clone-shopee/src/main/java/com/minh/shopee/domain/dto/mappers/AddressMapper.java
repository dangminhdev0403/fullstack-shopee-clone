package com.minh.shopee.domain.dto.mappers;

import com.minh.shopee.domain.dto.response.AddressFullResponse;
import com.minh.shopee.domain.model.Address;

public class AddressMapper {

        public static AddressFullResponse toFullResponse(
                        Address address,
                        String provinceName,
                        String districtName,
                        String wardName) {
                String fullAddress = String.format(
                                "%s, %s, %s, %s",
                                address.getAddressDetail(),
                                wardName,
                                districtName,
                                provinceName);

                return new AddressFullResponse(
                                address.getId(),
                                address.getName(),
                                address.getPhone(),
                                address.getAddressDetail(),
                                address.getProvinceId(),
                                address.getDistrictId(),
                                address.getWardId(),
                                address.getIsDefault(),
                                address.getType(),
                                fullAddress);
        }
}