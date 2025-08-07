package com.minh.shopee.domain.dto.request;

import java.math.BigDecimal;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class ProductReqDTO {
    @NotBlank(message = "Name is required")
    private String name;
    
    private String description;

    @NotNull(message = "Price is required")
    private BigDecimal price;

    @NotNull(message = "Stock is required")
    @Min(value = 1, message = "Stock must be >= 1")
    private Integer stock;
    @NotNull(message = "CategoryId is required")
    private Long categoryId;

}
