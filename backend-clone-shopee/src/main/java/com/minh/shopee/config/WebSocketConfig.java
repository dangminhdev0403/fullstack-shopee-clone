package com.minh.shopee.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.ChannelRegistration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

import com.minh.shopee.config.interceptor.WebSocketAuthInterceptor;

@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {
    @Autowired
    private WebSocketAuthInterceptor webSocketAuthInterceptor;

    @Override
    public void configureMessageBroker(MessageBrokerRegistry config) {
        // Simple Broker: nơi server đẩy message cho client
        // /topic : dùng cho chat public (broadcast)
        // /queue : dùng cho chat riêng (private)
        config.enableSimpleBroker("/topic", "/queue");
        // Prefix cho các message client gửi lên server
        // Client sẽ gửi tới: /app/....
        config.setApplicationDestinationPrefixes("/app");
        // Prefix dành cho user riêng lẻ
        // Ví dụ: /user/{username}/queue/messages
        config.setUserDestinationPrefix("/user");
    }

    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        // Endpoint để client kết nối WebSocket
        // Ví dụ: ws://localhost:8080/ws
        registry.addEndpoint("/ws").setAllowedOriginPatterns("*")// cho phép mọi domain (dev)
                .withSockJS(); // fallback nếu browser không hỗ trợ websocket
    }

    /**
     * ⭐ CONFIG INTERCEPTOR ⭐
     *
     * 👉 Gắn WebSocketAuthInterceptor vào
     * channel nhận message từ client
     *
     * 👉 Nếu thiếu đoạn này:
     * - preSend() KHÔNG BAO GIỜ chạy
     * - JWT WebSocket vô dụng
     */
    @Override
    public void configureClientInboundChannel(ChannelRegistration registration) {
        registration.interceptors(webSocketAuthInterceptor);
    }
}
