package com.minh.shopee.domain.model;

import java.time.Instant;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.minh.shopee.domain.model.constants.OrderStatus;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import jakarta.persistence.Transient;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "orders")

public class Order {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String receiverName;
    private String receiverAddress;
    private String receiverPhone;
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss: a", timezone = "GMT+7")
    @Column(updatable = false)
    private Instant createdAt;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = true) // nullable để hỗ trợ khi User bị xóa
    private User user;

    @Enumerated(EnumType.STRING) // Lưu trạng thái dưới dạng chuỗi
    private OrderStatus status;

    @OneToMany(mappedBy = "order")
    List<OrderDetail> orderDetail;
    @Transient // Không được lưu vào cơ sở dữ liệu
    private OrderStatus prevStatus;

    public void setStatus(OrderStatus newStatus) {
        if (this.status != null) {
            this.prevStatus = this.status; // Lưu trạng thái hiện tại vào prevStatus
        }
        this.status = newStatus; // Cập nhật trạng thái mới
    }

    @PrePersist
    public void prePersist() {
        if (status == null) {
            status = OrderStatus.PENDING; // Gán mặc định trước khi lưu
        }
    }
}
