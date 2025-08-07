package com.minh.shopee.services.utils.files.data;

import java.util.List;

import com.minh.shopee.domain.model.Product;
import com.minh.shopee.domain.model.ProductImage;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@AllArgsConstructor
@Getter
@Setter
@NoArgsConstructor
public class ProductData {
    private List<Product> listProducts;
    private List<ProductImage> listProductImages;
}
