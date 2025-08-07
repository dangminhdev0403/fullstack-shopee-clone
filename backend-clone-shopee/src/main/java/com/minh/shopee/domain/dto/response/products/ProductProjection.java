package com.minh.shopee.domain.dto.response.products;

import java.math.BigDecimal;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Builder
@Getter
@Setter
@AllArgsConstructor
public class ProductProjection {
    private Long id;
    private String name;
    private BigDecimal price;
    private Integer stock;

}
