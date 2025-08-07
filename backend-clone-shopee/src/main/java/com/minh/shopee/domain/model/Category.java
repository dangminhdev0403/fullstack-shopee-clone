package com.minh.shopee.domain.model;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.minh.shopee.domain.base.BaseEntity;

import jakarta.persistence.Entity;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;

@Entity
@Table(name = "categories")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@SuperBuilder
public class Category extends BaseEntity {

    @OneToMany(mappedBy = "category")
    @JsonIgnore
    private List<Product> products;
}
