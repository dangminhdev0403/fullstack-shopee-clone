package com.minh.shopee.domain.dto.response.projection.admin;

import java.util.List;

import com.minh.shopee.domain.model.ProductImage;

public interface ProductImageProjection {
    List<ProductImage> getImages();

}
