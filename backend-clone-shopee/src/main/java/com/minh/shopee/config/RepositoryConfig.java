package com.minh.shopee.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import com.minh.shopee.domain.model.Message;
import com.minh.shopee.domain.model.Order;
import com.minh.shopee.domain.model.OrderDetail;
import com.minh.shopee.domain.model.Product;
import com.minh.shopee.domain.model.ProductImage;
import com.minh.shopee.domain.model.User;
import com.minh.shopee.repository.GenericRepositoryCustom;
import com.minh.shopee.services.repocustom.GenericRepositoryImpl;

@Configuration
public class RepositoryConfig {

    @Bean
    public GenericRepositoryCustom<Product> productRepositoryCustom() {
        return new GenericRepositoryImpl<>(Product.class);
    }

    @Bean
    public GenericRepositoryCustom<User> userRepositoryCustom() {
        return new GenericRepositoryImpl<>(User.class);
    }

    @Bean
    public GenericRepositoryCustom<ProductImage> productImageRepositoryCustom() {
        return new GenericRepositoryImpl<>(ProductImage.class);
    }

    @Bean
    public GenericRepositoryCustom<Order> orderRepositoryCustom() {
        return new GenericRepositoryImpl<>(Order.class);
    }

    @Bean
    public GenericRepositoryCustom<OrderDetail> orderDetailCustomRepo() {
        return new GenericRepositoryImpl<>(OrderDetail.class);
    }

    @Bean
    public GenericRepositoryCustom<Message> messageCustomRepo() {
        return new GenericRepositoryImpl<>(Message.class);
    }

}