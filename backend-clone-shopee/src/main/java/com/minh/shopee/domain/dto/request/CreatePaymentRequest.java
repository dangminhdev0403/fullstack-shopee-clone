package com.minh.shopee.domain.dto.request;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CreatePaymentRequest {
    private long amount; // số tiền VND (ví dụ 10000)
    private String orderInfo; // thông tin đơn hàng (ví dụ: "Thanh toan don hang #123")
    private String orderType; // loại đơn hàng (ví dụ: "other")
    private String locale; // ngôn ngữ (vn | en)
    private String returnUrl; // url redirect sau khi thanh toán (frontend sẽ truyền)
}
