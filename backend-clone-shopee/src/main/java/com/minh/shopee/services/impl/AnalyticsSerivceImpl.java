package com.minh.shopee.services.impl;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import com.minh.shopee.domain.dto.response.analytics.ProductOverviewDTO;
import com.minh.shopee.domain.model.Shop;
import com.minh.shopee.domain.specification.ProductSpecification;
import com.minh.shopee.repository.ProductRepository;
import com.minh.shopee.repository.ShopRepository;
import com.minh.shopee.services.AnalyticsService;
import com.minh.shopee.services.utils.SecurityUtils;
import com.minh.shopee.services.utils.error.AppException;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AnalyticsSerivceImpl implements AnalyticsService {
    private final ProductRepository productRepository;
    private final ShopRepository shopRepository;

    @Override
    public ProductOverviewDTO getProductOverview() {
        long userId = SecurityUtils.getCurrentUserId();
        Shop shop = this.shopRepository.findByOwnerId(userId).orElseThrow(
                () -> new AppException(HttpStatus.BAD_REQUEST.value(), "Shop not found",
                        "Không tìm thấy shop của User này"));
        long totalSold = productRepository
                .count(ProductSpecification.hasBeenSold().and(ProductSpecification.hasShopId(shop.getId())));
        long totalZeroStock = productRepository
                .count(ProductSpecification.isZeroStock().and(ProductSpecification.hasShopId(shop.getId())));

        return ProductOverviewDTO.builder().sold(totalSold).outOfStock(totalZeroStock).build();
    }

}
