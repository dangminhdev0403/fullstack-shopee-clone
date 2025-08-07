package com.minh.shopee.services.utils.mapper;

import com.minh.shopee.domain.dto.response.products.ProductResDTO;
import com.minh.shopee.domain.model.Product;

public class ProductMapper {
    private ProductMapper() {

    }

    public static ProductResDTO toProductResDTO(Product product) {
        return ProductResDTO.builder()
                .name(product.getName())
                .price(product.getPrice())
                .stock(product.getStock())
                .build();
    }

    public static Product toProduct(ProductResDTO productResDTO) {
        return Product.builder()
                .name(productResDTO.getName())
                .price(productResDTO.getPrice())
                .stock(productResDTO.getStock())
                .build();
    }
}
