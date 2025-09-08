package com.minh.shopee.domain.dto.request;

import java.math.BigDecimal;

import com.minh.shopee.domain.constant.ProductStatus;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class ProductUpdateDTO {
    @NotNull(message = "Id is required")
    private Long id;
    private String name;

    private String description;

    private BigDecimal price;

    @Min(value = 1, message = "Stock must be >= 1")
    private Integer stock;
    private Long categoryId;

    private ProductStatus status;

}
