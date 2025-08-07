package com.minh.shopee.config;

import java.util.List;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.security.SecurityScheme;
import io.swagger.v3.oas.models.servers.Server;

@Configuration
public class SwaggerConfig {

    private SecurityScheme createAPIKeyScheme() {
        return new SecurityScheme()

                .type(SecurityScheme.Type.HTTP)
                .bearerFormat("JWT")
                .scheme("bearer")
                .description("API key for authentication");
    }

    @Bean
    public OpenAPI customOpenAPI() {

        Server server = new Server();
        server.setUrl("http://localhost:8080");
        server.setDescription("Local server");
        Contact contact = new Contact();
        contact.setName("Minh");
        Info info = new Info()
                .title("Shopee API")
                .version("1.0")
                .description("API documentation for Shopee application")
                .contact(contact);
        return new OpenAPI()
                .info(info)
                .servers(List.of(server))
                .components(new io.swagger.v3.oas.models.Components()
                        .addSecuritySchemes("bearerAuth", createAPIKeyScheme()));
    }
}
