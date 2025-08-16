package com.minh.shopee.domain.dto.request;

import java.math.BigDecimal;
import java.util.List;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class CreateOrderRequest {

    @NotBlank(message = "Tên người nhận không được để trống")
    @Size(max = 100, message = "Tên người nhận không vượt quá 100 ký tự")
    private String receiverName;

    @NotBlank(message = "Địa chỉ không được để trống")
    @Size(max = 255, message = "Địa chỉ không vượt quá 255 ký tự")
    private String receiverAddress;

    @NotBlank(message = "Số điện thoại không được để trống")
    @Pattern(regexp = "^(0|\\+84)\\d{9,10}$", message = "Số điện thoại không hợp lệ")
    private String receiverPhone;

    @NotBlank(message = "Phương thức thanh toán không được để trống")
    private String paymentMethod;

    @NotNull(message = "Phí vận chuyển không được để trống")
    @DecimalMin(value = "0.0", inclusive = true, message = "Phí vận chuyển phải >= 0")
    private BigDecimal shippingFee;

    @NotNull(message = "Giảm giá không được để trống")
    @DecimalMin(value = "0.0", inclusive = true, message = "Giảm giá phải >= 0")
    private BigDecimal discount;

    @NotEmpty(message = "Danh sách sản phẩm không được để trống")
    private List<OrderItemRequest> items;
}
