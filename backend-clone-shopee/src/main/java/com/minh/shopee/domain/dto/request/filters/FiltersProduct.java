package com.minh.shopee.domain.dto.request.filters;

import java.util.Optional;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
@AllArgsConstructor
public class FiltersProduct {

    private Optional<String> minPrice;
    private Optional<String> maxPrice;
    private Optional<String> keyword;
    
    private Optional<String> stock;
    private Optional<String> categoryId;
    private Optional<String> sortBy;

}