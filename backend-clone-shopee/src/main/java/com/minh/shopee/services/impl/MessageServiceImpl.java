package com.minh.shopee.services.impl;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import com.minh.shopee.domain.dto.request.ChatRequest;
import com.minh.shopee.domain.model.Message;
import com.minh.shopee.domain.model.User;
import com.minh.shopee.domain.specification.MessageSpecification;
import com.minh.shopee.repository.GenericRepositoryCustom;
import com.minh.shopee.repository.MessageRepository;
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
    private final MessageRepository messageRepository;

    @Override
    public Page<Message> getConversation(ChatRequest request, Pageable pageable) {
        long senderId = securityUtils.getCurrentUserId();
        long receiverId = Long.parseLong(request.getReceiver());

        Specification<Message> spec = MessageSpecification.betweenUsers(senderId, receiverId);
        return this.messageCustomRepo.findAll(spec, pageable, Message.class);

    }

    @Override
    public Message save(String senderStr, ChatRequest request) {
        Message message = new Message();
        long senderId = Long.parseLong(senderStr);
        long receiverId = Long.parseLong(request.getReceiver());

        message.setContent(request.getContent());
        User sender = new User();
        sender.setId(senderId);
        message.setSender(sender);
        User receiver = new User();
        receiver.setId(receiverId);
        message.setReceiver(receiver);
        return this.messageRepository.save(message);
    }

    @Override
    public <T> Page<T> getListConversation(Class<T> type, Pageable pageable) {
        long senderId = securityUtils.getCurrentUserId();

        Specification<Message> spec = MessageSpecification.belongsToUser(senderId);

        return this.messageCustomRepo.findAll(spec, pageable, type);
    }

}
