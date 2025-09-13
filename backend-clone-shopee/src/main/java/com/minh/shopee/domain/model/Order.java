package com.minh.shopee.domain.model;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.UUID;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.minh.shopee.domain.constant.OrderStatus;
import com.minh.shopee.domain.constant.PaymentMethod;

import jakarta.persistence.CascadeType;
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
    BigDecimal totalPrice; // Tổng giá trị đơn hàng
    // Mã đơn nội bộ
    @Column(unique = true, nullable = false)
    private String code;
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss: a", timezone = "GMT+7")
    @Column(updatable = false)
    private Instant createdAt;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = true) // nullable để hỗ trợ khi User bị xóa
    @JsonIgnore
    private User user;

    @Enumerated(EnumType.STRING) // Lưu trạng thái dưới dạng chuỗi
    private OrderStatus status;

    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, orphanRemoval = true)
    List<OrderDetail> orderDetail;

    @Transient // Không được lưu vào cơ sở dữ liệu
    private OrderStatus prevStatus;

    public void setStatus(OrderStatus newStatus) {
        if (this.status != null) {
            this.prevStatus = this.status; // Lưu trạng thái hiện tại vào prevStatus
        }
        this.status = newStatus; // Cập nhật trạng thái mới
    }

    PaymentMethod paymentMethod;

    @PrePersist
    public void prePersist() {
        if (paymentMethod == null) {
            paymentMethod = PaymentMethod.COD;
        }
        if (status == null) {
            status = OrderStatus.PENDING; // Gán mặc định trước khi lưu
        }
        if (createdAt == null) {
            this.createdAt = Instant.now();
        }
        if (code == null || code.isEmpty()) {
            String date = LocalDate.now().format(DateTimeFormatter.ofPattern("yyyyMMdd"));
            String random = UUID.randomUUID().toString().substring(0, 6).toUpperCase();

            this.code = "SP" + date + "-" + random; // Tạo mã đơn hàng duy nhất
        }
    }
}
