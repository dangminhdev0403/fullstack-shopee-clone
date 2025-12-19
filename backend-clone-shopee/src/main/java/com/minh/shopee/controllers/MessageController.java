package com.minh.shopee.controllers;

import java.security.Principal;

import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

import com.minh.shopee.domain.dto.request.ChatRequest;
import com.minh.shopee.domain.model.ChatMessage;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Controller
@Slf4j
@RequiredArgsConstructor
public class MessageController {
        /*
         * SimpMessagingTemplate:
         * - Cho phép gửi message thủ công
         * - Không cần @SendTo
         */
        private final SimpMessagingTemplate messagingTemplate;

        /*
         * Client gửi message tới: /app/send
         * (vì ApplicationDestinationPrefixes = /app)
         */
        @MessageMapping("/send")
        /*
         * Sau khi xử lý xong, server sẽ gửi message
         * tới tất cả client đang subscribe:
         * /topic/messages
         *
         * → Đây chính là CHAT CÔNG KHAI
         */
        @SendTo("/topic/messages")
        public ChatMessage sendMessage(ChatRequest message) {
                /*
                 * Tạo message mới để gửi xuống client
                 * message.getSender() : người gửi
                 * message.getContent() : nội dung
                 * System.currentTimeMillis(): thời gian gửi
                 */
                ChatMessage sendMessage = new ChatMessage(message.getSender(), message.getContent(),
                                System.currentTimeMillis());
                log.info(sendMessage.getContent());
                // Return object → Spring tự gửi xuống /topic/messages
                return sendMessage;
        }

        @MessageMapping("/chat.private")
        public void chatPrivate(
                        ChatRequest request,
                        Principal principal) {
                if (principal == null) {
                        throw new IllegalStateException("WebSocket Principal is null");
                }
                log.info("check userId" + principal.getName() + " Send message:" + request.getContent());
                messagingTemplate.convertAndSendToUser(
                                request.getReceiver(), // username người nhận
                                "/queue/messages",
                                new ChatMessage(
                                                principal.getName(), // sender từ JWT
                                                request.getContent(),
                                                System.currentTimeMillis()));
        }

}
