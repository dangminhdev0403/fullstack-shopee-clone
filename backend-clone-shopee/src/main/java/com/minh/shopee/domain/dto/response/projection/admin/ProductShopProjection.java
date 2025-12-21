package com.minh.shopee.domain.dto.response.projection.admin;

import java.math.BigDecimal;

import com.minh.shopee.domain.model.Shop;

public interface ProductShopProjection {
    Long getId();

    String getName();

    String getDescription();

    BigDecimal getPrice();

    Integer getStock();

    CategoryProjection getCategory();

    ProductImageProjection getImages();

    String getStatus();

    interface CategoryProjection {
        Long getId();

        String getName();
    }

    interface ProductImageProjection {
        Shop getShop();

        String getImageUrl();
    }

    interface ShopProjection {
        long getId();
    }

}
