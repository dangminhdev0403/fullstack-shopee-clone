package com.minh.shopee.controllers;

import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;

import com.minh.shopee.domain.dto.request.ChatRequest;
import com.minh.shopee.domain.model.ChatMessage;

@Controller
public class MessageController {
    @MessageMapping("/send")
    @SendTo("/topic/messages")
    public ChatMessage sendMessage(ChatRequest message) {
        ChatMessage sendMessage = new ChatMessage(message.getSender(), message.getContent(),
                System.currentTimeMillis());

        return sendMessage;
    }
}
