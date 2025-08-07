package com.minh.shopee;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.data.web.config.EnableSpringDataWebSupport;
import org.springframework.data.web.config.PageableHandlerMethodArgumentResolverCustomizer;

@SpringBootApplication
@EnableSpringDataWebSupport(pageSerializationMode = EnableSpringDataWebSupport.PageSerializationMode.VIA_DTO)
public class ShopeeApplication {

	public static void main(String[] args) {
		SpringApplication.run(ShopeeApplication.class, args);
	}

	@Bean
	public PageableHandlerMethodArgumentResolverCustomizer customizePageable() {
		return resolver -> resolver.setOneIndexedParameters(true); // page=1 là trang đầu
	}
}
