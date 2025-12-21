package com.minh.shopee.services.impl;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import com.minh.shopee.domain.constant.SenderType;
import com.minh.shopee.domain.dto.request.ChatRequest;
import com.minh.shopee.domain.model.Message;
import com.minh.shopee.domain.specification.MessageSpecification;
import com.minh.shopee.repository.GenericRepositoryCustom;
import com.minh.shopee.services.MessageService;
import com.minh.shopee.services.ShopService;
import com.minh.shopee.services.utils.SecurityUtils;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class MessageServiceImpl implements MessageService {
    private final GenericRepositoryCustom<Message> messageCustomRepo;
    private final SecurityUtils securityUtils;
    private final ShopService shopService;

    @Override
    public Page<Message> getConversation(ChatRequest request, Pageable pageable) {
        long senderId = securityUtils.getCurrentUserId();
        long receiverId = Long.parseLong(request.getReceiver());
        if (request.getSenderType().compareTo(SenderType.USER) == 0) {
            receiverId = this.shopService.getOnerIdByShopId(receiverId);
        }
        Specification<Message> spec = MessageSpecification.betweenUsers(senderId, receiverId);
        return this.messageCustomRepo.findAll(spec, pageable, Message.class);

    }

}
