package com.minh.shopee.domain.model;

import java.util.List;

import com.minh.shopee.domain.base.ShopStatus;

import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OneToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;

@Entity
@Table(name = "shops")
@Getter
@Setter
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
public class Shop {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String shopName;
    private String email;
    private String phone;
    private String shippingAddress;
    private long cityId;
    private long districtId;
    private String wardCode;

    @Enumerated(EnumType.STRING) // Lưu trạng thái dưới dạng chuỗi
    private ShopStatus status;
    @OneToOne
    @JoinColumn(name = "owner_id", referencedColumnName = "id", unique = true)
    private User owner;
    @OneToMany(mappedBy = "shop")
    private List<Product> products;

    @PrePersist
    public void prePersist() {
        if (status == null) {
            status = ShopStatus.PENDING; // Gán mặc định trước khi lưu
        }
    }
}
