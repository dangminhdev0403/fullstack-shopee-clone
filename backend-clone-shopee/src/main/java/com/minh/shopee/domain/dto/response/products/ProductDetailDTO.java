package com.minh.shopee.domain.dto.response.products;

import java.math.BigDecimal;
import java.util.List;

import com.minh.shopee.domain.model.ProductImage;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
@Builder
public class ProductDetailDTO {
    private Long id;
    private String name;
    private BigDecimal price;
    private List<ProductImage> images;
    private Integer stock;
}
