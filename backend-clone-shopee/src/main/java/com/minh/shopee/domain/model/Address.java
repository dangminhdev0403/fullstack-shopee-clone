package com.minh.shopee.domain.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.minh.shopee.domain.base.BaseEntity;

import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;

@SuperBuilder
@Getter
@Setter
@Table(name = "addresses")
@Entity
@AllArgsConstructor
@NoArgsConstructor
public class Address extends BaseEntity {

    private String phone;
    private String addressDetail;
    private Long provinceId;
    private Long districtId;
    private Long wardId;
    private String fullAddress;

    private Boolean isDefault;
    private String type;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    @JsonIgnore
    private User user;
}
