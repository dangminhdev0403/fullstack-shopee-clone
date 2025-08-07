package com.minh.shopee.domain.dto.response.products;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

@Builder
@Getter
@AllArgsConstructor
public class ProductImageDTO {
    
    private String imageUrl;

}
