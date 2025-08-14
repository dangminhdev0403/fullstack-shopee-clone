package com.minh.shopee.domain.model;

import java.math.BigDecimal;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.minh.shopee.domain.base.BaseEntity;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;

@SuperBuilder
@Getter
@Setter
@Table(name = "products")
@Entity
@AllArgsConstructor
@NoArgsConstructor
public class Product extends BaseEntity {

    @Column(columnDefinition = "LONGTEXT", nullable = false)
    private String description;

    @Column(precision = 10, scale = 2)
    private BigDecimal price;

    private Integer stock;

    @OneToMany(mappedBy = "product")
    // @JsonIgnore
    private List<ProductImage> images;

    @ManyToOne
    private Category category;

    @ManyToOne
    private Shop shop;

    @OneToMany(mappedBy = "product")
    @JsonIgnore
    private List<CartDetail> cartDetails;

    @OneToMany(mappedBy = "product", cascade = CascadeType.PERSIST) // Chỉ giữ lại PERSIST
    @JsonIgnore
    List<OrderDetail> orderDetails;

}
