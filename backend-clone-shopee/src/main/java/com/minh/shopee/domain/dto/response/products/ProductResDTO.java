package com.minh.shopee.domain.dto.response.products;

import java.math.BigDecimal;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Builder
@Getter
@AllArgsConstructor
@NoArgsConstructor
@Setter
public class ProductResDTO {
    private Long id;
    private String name;
    private BigDecimal price;
    private String imageUrl;
    private Integer stock;

}
