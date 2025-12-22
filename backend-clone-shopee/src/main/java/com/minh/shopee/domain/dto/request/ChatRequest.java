package com.minh.shopee.domain.dto.request;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class ChatRequest {

    // ⭐ Người nhận (bắt buộc cho chat riêng)
    private String receiver;

    // Nội dung tin nhắn
    private String content;

}
