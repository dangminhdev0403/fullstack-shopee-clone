package com.minh.shopee.services;

import java.util.List;

import com.minh.shopee.domain.dto.request.AddAddressDTO;
import com.minh.shopee.domain.dto.request.EditAddressDTO;
import com.minh.shopee.domain.model.Address;

public interface AddressService {
    List<Address> getAllAddresses(Long userId);

    // AddressFullResponse getAddressFullById(Long addressId);

    void addAddress(AddAddressDTO request, Long userId);

    void updateAddress(EditAddressDTO request);

    void deleteAddress(Long addressId, Long userId);
}
