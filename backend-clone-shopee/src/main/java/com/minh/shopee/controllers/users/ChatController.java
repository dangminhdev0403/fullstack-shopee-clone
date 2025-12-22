package com.minh.shopee.controllers.users;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.minh.shopee.domain.anotation.ApiDescription;
import com.minh.shopee.domain.dto.request.ChatRequest;
import com.minh.shopee.domain.dto.response.projection.MessageProjection;
import com.minh.shopee.domain.model.Message;
import com.minh.shopee.services.MessageService;

import lombok.RequiredArgsConstructor;

@RestController()
@RequestMapping("/api/v1/chats")
@RequiredArgsConstructor
public class ChatController {

    private final MessageService messageService;

    @PostMapping("/conversation")
    @ApiDescription("Lấy lịch sử trò chuyện giữa 2 người dùng")
    public Page<Message> getConversation(@RequestBody ChatRequest request,
            @PageableDefault(page = 0, size = 10) Pageable pageable) {

        Page<Message> messages = messageService.getConversation(request, pageable);
        return messages;
    }

    @GetMapping("")
    @ApiDescription("Lấy lịch sử trò chuyện giữa 2 người dùng")
    public Page<MessageProjection> getListHistoryChat(@PageableDefault(page = 0, size = 10) Pageable pageable) {

        Page<MessageProjection> messages = messageService.getListConversation(MessageProjection.class, pageable);
        return messages;
    }
}
