package com.minh.shopee.config.interceptor;

import org.springframework.messaging.Message;
import org.springframework.messaging.MessageChannel;
import org.springframework.messaging.simp.stomp.StompCommand;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.messaging.support.ChannelInterceptor;
import org.springframework.messaging.support.MessageHeaderAccessor;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;

import com.minh.shopee.services.utils.SecurityUtils;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * WebSocketAuthInterceptor
 *
 * 👉 Vai trò:
 * - Thay thế SecurityFilterChain cho WebSocket
 * - Lấy JWT từ header khi client CONNECT
 * - Verify JWT
 * - Gắn Principal cho WebSocket session
 *
 * 👉 Vì sao cần:
 * - WebSocket KHÔNG đi qua HttpSecurity
 * - Nếu không có class này:
 * + Principal = null
 * + Chat riêng không hoạt động
 * + Client có thể fake user
 */
@Component("channelInterceptor")
@Slf4j
@RequiredArgsConstructor
public class WebSocketAuthInterceptor implements ChannelInterceptor, HandlerInterceptor {
    private final SecurityUtils securityUtils;

    /**
     * preSend()
     *
     * 👉 Được gọi TRƯỚC khi message WebSocket
     * đi vào @MessageMapping
     *
     * 👉 Tất cả message đều đi qua đây:
     * CONNECT / SEND / SUBSCRIBE
     */
    @Override
    public Message<?> preSend(Message<?> message, MessageChannel channel) {

        StompHeaderAccessor accessor = MessageHeaderAccessor.getAccessor(message, StompHeaderAccessor.class);

        if (accessor == null)
            return message;

        // ✅ Chỉ xác thực khi CONNECT
        if (StompCommand.CONNECT.equals(accessor.getCommand())) {

            String authHeader = accessor.getFirstNativeHeader("Authorization");

            if (authHeader == null || !authHeader.startsWith("Bearer ")) {
                throw new IllegalArgumentException("Missing Authorization header");
            }
            // ! Nạp vào Sercurity Context ( Không có auto ăn lỗi :` User not null `)

            String token = authHeader.substring(7);

            // ✅ 1. Decode JWT → Authentication
            var authentication = securityUtils.getAuthentication(token);

           
            // ✅ 2. Set SecurityContext (CHO SecurityUtils)
            var context = SecurityContextHolder.createEmptyContext();
            context.setAuthentication(authentication);
            SecurityContextHolder.setContext(context);
            Long userId = SecurityUtils.getCurrentUserId();
            // ✅ 3. Set Principal (CHO convertAndSendToUser)
            accessor.setUser(() -> String.valueOf(userId));

            log.info("WebSocket CONNECT authenticated user = {}", authentication.getName());
        }

        return message;
    }
}