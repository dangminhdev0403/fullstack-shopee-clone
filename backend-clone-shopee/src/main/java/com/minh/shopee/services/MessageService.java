package com.minh.shopee.services;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import com.minh.shopee.domain.dto.request.ChatRequest;
import com.minh.shopee.domain.model.Message;

public interface MessageService {
    Page<Message> getConversation(ChatRequest request, Pageable pageable);
}
