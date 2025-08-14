package com.minh.shopee.services.impl;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import com.minh.shopee.domain.dto.request.CreateShopDTO;
import com.minh.shopee.domain.model.Shop;
import com.minh.shopee.domain.model.User;
import com.minh.shopee.repository.ShopRepository;
import com.minh.shopee.services.ShopService;
import com.minh.shopee.services.utils.error.AppException;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j(topic = "ShopService")
public class ShopServiceImpl implements ShopService {
    private final ShopRepository shopRepository;

    @Override
    public void createShop(CreateShopDTO request, Long userId) {
        if (shopRepository.existsByOwnerId(userId)) {
            throw new AppException(HttpStatus.BAD_REQUEST.value(), "Shop is already exist",
                    "Không thể gửi yêu cầu tạo shop");
        }
        boolean isEmailExist = shopRepository.existsByEmail(request.getEmail());

        if (isEmailExist)
            throw new AppException(HttpStatus.BAD_REQUEST.value(), "Email is already exist", "Email đã tồn tại");

        User user = User.builder().id(userId).build();
        Shop shop = Shop.builder().shopName(request.getShopName()).email(request.getEmail()).phone(request.getPhone())
                .shippingAddress(request.getShippingAddress()).cityId(request.getCityId())
                .districtId(request.getDistrictId()).wardCode(request.getWardCode()).owner(user).build();
        this.shopRepository.save(shop);
        log.info("Shop created: {}", shop.getId());
    }

}
