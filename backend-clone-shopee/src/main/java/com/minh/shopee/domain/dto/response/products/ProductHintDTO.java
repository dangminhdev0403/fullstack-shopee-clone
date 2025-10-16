package com.minh.shopee.domain.dto.response.products;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
@Builder

public class ProductHintDTO {
    private Long id;
    private String name;
}
